type CnItem = string | boolean | undefined;

export const cn = (...classnames: CnItem[]) => {
  return classnames.filter((classname) => !!classname && typeof classname === 'string').join(' ');
};

// trdt
