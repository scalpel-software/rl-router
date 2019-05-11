import React from 'react';
import { isImmutable } from '../util/immutable';

export default (WrappedComponent) => (wrappedProps) => {
  const propsJS = Object.keys(wrappedProps).reduce((props, key) => ({
    ...props,
    [key]: isImmutable(wrappedProps[key])
      ? wrappedProps[key].toJS()
      : wrappedProps[key]
  }), {});

  return <WrappedComponent {...propsJS} />;
};
