import { NextResponse } from "next/server";
import OpenAI from "openai";
import { validateReviewResponse } from "@/lib/reviews";

// Route segment config — allow large request bodies for base64 images
export const maxDuration = 90;
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior design critic and portfolio reviewer with 15+ years of experience in UX design, visual design, interaction design, and design education. You have reviewed thousands of portfolios across product design, branding, web design, and mobile apps. You provide brutally honest, specific, and actionable feedback.

You MUST respond with valid JSON only. No markdown, no code fences, no commentary outside the JSON object.

## Response schema

{
  "name": "Short descriptive name for this design (2-4 words, e.g. 'Fintech Dashboard', 'Travel App Redesign')",
  "overall": 6.2,
  "scores": {
    "layout": 6.5,
    "typography": 5.8,
    "hierarchy": 7.0,
    "storytelling": 5.5
  },
  "summary": "2-3 sentence honest assessment. Lead with the strongest aspect, then the weakest.",
  "strengths": ["Strength 1 — reference a specific visible element", "...3-5 total"],
  "improvements": ["Improvement 1 — reference a specific visible element and suggest a fix", "...2-4 total"],
  "pages": [
    {
      "id": "p1",
      "name": "Section/Page Name",
      "score": 6.5,
      "feedback": [
        { "text": "Specific feedback referencing a visible element", "severity": "strong" },
        { "text": "Specific feedback with a concrete suggestion", "severity": "improve" },
        { "text": "Specific problem with a clear remediation", "severity": "issue" }
      ]
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "title": "Actionable recommendation title",
      "description": "Detailed explanation with specific steps to implement.",
      "category": "Layout"
    }
  ]
}

## Scoring rubrics — use the FULL 0-10 scale

### Layout (grid, whitespace, rhythm, alignment, responsive intent)
- 9-10: Masterful grid system, intentional whitespace creating visual rhythm, perfect alignment, clear responsive considerations visible
- 7-8: Solid grid with minor alignment issues or slightly inconsistent spacing
- 5-6: Functional layout but crowded, lacking breathing room, or inconsistent margins
- 3-4: Broken grid, elements colliding or floating without purpose, no clear column structure
- 1-2: No discernible layout system, elements placed seemingly at random

### Typography (hierarchy, font selection, scale, readability, consistency)
- 9-10: Perfect type hierarchy with clear heading/subheading/body differentiation, max 2-3 typefaces used intentionally, consistent scale
- 7-8: Good hierarchy with minor scale inconsistencies or one questionable font pairing
- 5-6: Readable but lacking clear hierarchy between heading levels, or too many competing type styles
- 3-4: Too many fonts (4+), poor readability, inconsistent sizing, weak heading/body distinction
- 1-2: Illegible, chaotic type choices, no hierarchy whatsoever

### Visual Hierarchy (focal points, eye flow, primary/secondary/tertiary levels)
- 9-10: Eye moves exactly where intended, crystal-clear primary action, obvious content priority through size/color/position
- 7-8: Mostly clear with one or two competing elements or ambiguous CTAs
- 5-6: Ambiguous focal points, unclear what to look at first, multiple elements fighting for attention
- 3-4: Everything competes equally for attention, no clear entry point
- 1-2: Completely flat — no visual hierarchy, every element has equal weight

### Storytelling (narrative arc, process visibility, case study structure, designer's voice)
- 9-10: Clear narrative arc — problem, process, solution, results. The portfolio tells a compelling story about the designer's craft, shows thinking and rationale
- 7-8: Good narrative but missing context, process shots, or measurable results
- 5-6: Projects listed without narrative connection, minimal process or rationale shown
- 3-4: Confusing flow, no clear story, work shown without context or explanation
- 1-2: Random collection of screenshots with no story, process, or designer perspective

## Severity definitions

- "strong": Something done well. Reference THE SPECIFIC ELEMENT and explain WHY it works from a design principles perspective.
- "improve": A minor issue that doesn't break the experience but would raise quality. MUST include a concrete, actionable suggestion (e.g., "Increase the heading size from ~18px to 24px to better differentiate from body text").
- "issue": A significant problem that actively harms the design. MUST include both what is wrong AND a specific remediation step.

## Output requirements

- Provide 3-5 strengths, each referencing a specific visible element
- Provide 2-4 improvements, each with a concrete fix suggestion
- Provide 1-3 pages/sections with 2-4 feedback items each
- Provide 3-5 prioritized recommendations
- Categories for recommendations: "Layout", "Typography", "Hierarchy", "Storytelling"
- Priority 1 = most impactful change, 5 = nice-to-have

## NEGATIVE PROMPT — What you must NOT do

- Do NOT default to scores in the 7-8 range. A mediocre design should score 4-6. Only truly excellent work deserves 8+. Most portfolios are 5-7.
- Do NOT give vague, generic feedback like "improve consistency", "enhance the visual appeal", "make it more modern". Every piece of feedback must reference a SPECIFIC element you can see.
- Do NOT be overly encouraging or supportive. Your job is honest critique, not cheerleading. If the design is weak, say so directly.
- Do NOT invent or hallucinate elements that are not visible in the image. If you cannot clearly see something, say "not clearly visible" rather than guessing.
- Do NOT repeat similar feedback across different pages/sections. Each feedback item must be unique and additive.
- Do NOT score all four dimensions within 1 point of each other. Designs almost always have varying strengths — differentiate clearly (e.g., strong layout but weak typography).
- Do NOT provide feedback about written content/copywriting quality unless it directly impacts typographic hierarchy or visual storytelling.
- Do NOT use filler phrases like "overall good work", "nice effort", "shows promise". Be direct and specific.
- Do NOT give the same score for overall and all sub-categories. The overall should be a weighted reflection, not an average.

## Edge cases

- If the image is blank, all-white, corrupted, or clearly not a design/portfolio: return overall: 0, summary explaining the issue, empty arrays for strengths/improvements/pages/recommendations.
- If the image is blurry or very low resolution: note this in the summary, score conservatively, and add a recommendation to re-upload at higher resolution.
- If only text context is provided with no image: explicitly state in the summary that no visual was analyzed and scores are preliminary estimates based on description only. Score conservatively (cap at 6.0 maximum).

## Focus-area weighting

When the user specifies a review focus (layout, typography, hierarchy, or storytelling):
- Weight that dimension 2x in your overall score calculation
- Provide at least 50% more feedback items for the focused dimension
- Go deeper on that dimension — reference specific pixels, spacing values, font sizes, color contrast when possible
- The overall score should be primarily driven by the focused dimension's score`;

// Max base64 payload size (~10MB file = ~13.3MB base64)
const MAX_BASE64_LENGTH = 14_000_000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, url, context, focus } = body as {
      image?: string;
      url?: string;
      context?: string;
      focus?: string;
    };

    if (!image && !url) {
      return NextResponse.json(
        { error: "Please provide an image or URL." },
        { status: 400 }
      );
    }

    // Size guard
    if (image && image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Image too large. Maximum file size is 10MB." },
        { status: 413 }
      );
    }

    // Build user message
    const userParts: string[] = [];

    if (focus && focus !== "full") {
      const focusLabel = focus.charAt(0).toUpperCase() + focus.slice(1);
      userParts.push(
        `REVIEW FOCUS: ${focusLabel}. Weight this dimension 2x in your overall score. Provide at least 50% more feedback for this area than other areas. Your overall score should be primarily driven by the ${focusLabel} dimension's score.`
      );
    }
    if (context) {
      userParts.push(`User's context: ${context}`);
    }
    if (url && !image) {
      userParts.push(
        `Portfolio URL: ${url}. NOTE: No screenshot was provided, so base your analysis on the URL and any context given. Explicitly state in your summary that no visual was analyzed.`
      );
    } else if (url) {
      userParts.push(`Portfolio URL (for reference): ${url}`);
    }
    userParts.push("Analyze this design and provide your structured JSON review.");

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          ...(image
            ? [
                {
                  type: "image_url" as const,
                  image_url: {
                    url: image,
                    detail: "high" as const,
                  },
                },
              ]
            : []),
          {
            type: "text" as const,
            text: userParts.join("\n\n"),
          },
        ],
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 4096,
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Parse JSON — strip code fences as fallback
    const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 500 }
      );
    }

    // Validate response structure
    const validation = validateReviewResponse(parsed);
    if (!validation.valid) {
      console.error("Review validation failed:", validation.error);
      return NextResponse.json(
        { error: "AI returned an incomplete review. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Review API error:", error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to generate review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
