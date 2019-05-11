export default (errorMsg) => (...args) => {
  const argsString = args.reduce(
    (str, arg) => `${str && `${str}, `}${arg}`,
    ''
  );

  throw new Error(
    `${errorMsg && `${errorMsg} `} ${argsString &&
      `Was called with arguments ${argsString}.`}`
  );
};
