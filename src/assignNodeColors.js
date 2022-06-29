function getColour(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  );
}

export function assignNodeColors(category, institution_type) {
  if (category == "deployment") {
    return getColour("--deployment-colour");
  } else if (category == "dataset") {
    return getColour("--dataset-colour");
  } else if (category == "institution") {
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
  } else {
    return getColour("--other-colour");
  }
}
