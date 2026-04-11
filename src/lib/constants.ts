export const focusOptions = [
  { value: "full", label: "Full Review" },
  { value: "positioning", label: "Positioning & First Impression" },
  { value: "caseStudy", label: "Case Study & Storytelling" },
  { value: "visualDesign", label: "Visual Design & Craft" },
  { value: "strategicDepth", label: "Strategic Depth" },
  { value: "copywriting", label: "Copywriting Quality" },
];
export const focusValues = focusOptions.map((option) => option.value);

export const settingsFocusOptions = [
  { value: "full", label: "Full Review" },
  { value: "layout", label: "Layout Only" },
  { value: "typography", label: "Typography Only" },
  { value: "hierarchy", label: "Visual Hierarchy" },
  { value: "storytelling", label: "Storytelling" },
];
export const settingsFocusValues = settingsFocusOptions.map((option) => option.value);

export const pageTypeOptions = [
  { value: "auto", label: "Auto-detect" },
  { value: "Homepage", label: "Homepage" },
  { value: "Case Study", label: "Case Study" },
  { value: "About", label: "About / Bio" },
  { value: "Project Grid", label: "Work Overview / Grid" },
  { value: "Behance/Dribbble", label: "Behance / Dribbble" },
];
export const pageTypeValues = pageTypeOptions.map((option) => option.value);

export const levelOptions = [
  { value: "not-sure", label: "Not sure" },
  { value: "Junior", label: "Junior" },
  { value: "Mid", label: "Mid-level" },
  { value: "Senior", label: "Senior" },
  { value: "Lead-Manager", label: "Lead / Manager" },
];
export const levelValues = levelOptions.map((option) => option.value);
