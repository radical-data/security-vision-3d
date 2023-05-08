// This function gets the computed style of a specified CSS variable.
function getColour(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  );
}

// This function assigns colors to nodes based on their category and institution type.
export function assignNodeColors(category, institution_type) {
  // If the category is "deployment", return the corresponding color.
  if (category == "deployment") {
    return getColour("--deployment-colour");
  }
  // If the category is "dataset", return the corresponding color.
  else if (category == "dataset") {
    return getColour("--dataset-colour");
  }
  // If the category is "institution", determine the institution type and return the corresponding color.
  else if (category == "institution") {
    if (institution_type == "government") {
      return getColour("--government-colour");
    } else if (institution_type == "law enforcement") {
      return getColour("--law-enforcement-colour");
    } else if (institution_type == "company") {
      return getColour("--company-colour");
    } else if (institution_type == "ngo") {
      return getColour("--ngo-colour");
    } else if (institution_type == "research") {
      return getColour("--research-colour");
    } else {
      return getColour("--other-colour");
    }
  }
  // If the category is not recognised, return the color for "other".
  else {
    return getColour("--other-colour");
  }
}
