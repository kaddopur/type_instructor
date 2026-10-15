const getStatus = (damage: number) => {
  if (damage === 0) {
    return 'EFFECTIVE_0';
  } else if (damage < 1) {
    return 'EFFECTIVE_1_2';
  } else if (damage === 1) {
    return 'EFFECTIVE_1';
  } else if (damage > 1) {
    return 'EFFECTIVE_2';
  }
}

export default getStatus;
