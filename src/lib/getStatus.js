const getStatus = demage => {
  if (demage === 0) {
    return 'not effective';
  } else if (demage < 1) {
    return 'not very effective';
  } else if (demage === 1) {
    return 'effective';
  } else if (demage > 1) {
    return 'super effective';
  }
}

export default getStatus;
