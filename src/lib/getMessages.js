const getMessages = () => {
  return {
    en: require(`../lang/strings.json`),
    ja: require(`../lang/strings_ja.json`),
    zh: require(`../lang/strings_zh.json`)
  }
}

export default getMessages;
