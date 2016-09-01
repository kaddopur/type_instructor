const getMessages = (locale) => {
  if (!locale || locale === 'en') {
    return require(`../lang/strings.json`);
  }
  return require(`../lang/strings_${locale}.json`)    
}

export default getMessages;
