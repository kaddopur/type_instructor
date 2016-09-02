const getStatus = demage => {
  if (demage === 0) {
    return 'EFFECTIVE_0';
  } else if (demage < 1) {
    return 'EFFECTIVE_1_2';
  } else if (demage === 1) {
    return 'EFFECTIVE_1';
  } else if (demage > 1) {
    return 'EFFECTIVE_2';
  }
}

export default getStatus;
