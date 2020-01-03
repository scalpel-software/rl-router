import UrlPattern from 'url-pattern';
import React, { Children, Component, createFactory } from 'react';
import compose from "../util/compose";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import matchCache from '../util/match-cache';
import generateId from '../util/generate-id';
import throwError from '../util/throw-error';

const setStatic = (key, value) => BaseComponent => {
  /* eslint-disable no-param-reassign */
  BaseComponent[key] = value
  /* eslint-enable no-param-reassign */
  return BaseComponent
}

const getDisplayName = (Component) => {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

const wrapDisplayName = (BaseComponent, hocName) => {
  return `${hocName}(${getDisplayName(BaseComponent)})`;
}

const getContext = contextTypes => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const GetContext = (ownerProps, context) =>
    factory({
      ...ownerProps,
      ...context,
    })

  GetContext.contextTypes = contextTypes

  if (process.env.NODE_ENV !== 'production') {
    return setStatic('displayName', wrapDisplayName(BaseComponent, 'getContext'))(
      GetContext
    )
  }
  return GetContext
}

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  const factory = createFactory(BaseComponent)
  class WithContext extends Component {
    getChildContext = () => {
      return getChildContext(this.props)
    }

    render() {
      return factory(this.props)
    }
  }

  WithContext.childContextTypes = childContextTypes

  if (process.env.NODE_ENV !== 'production') {
    return setStatic('displayName', wrapDisplayName(BaseComponent, 'withContext'))(
      WithContext
    )
  }
  return WithContext
}

const withId = ComposedComponent =>
  class WithId extends Component {

    constructor() {
      super();
      this.id = generateId();
    }

    render() {
      return <ComposedComponent {...this.props} id={this.id} />;
    }
  };

const resolveChildRoute = (parentRoute, currentRoute) => {
  const parentIsRootRoute =
    parentRoute && parentRoute !== '/' && parentRoute !== currentRoute;

  return parentIsRootRoute
    ? `${parentRoute}${currentRoute || ''}`
    : currentRoute;
};

const resolveCurrentRoute = (parentRoute, currentRoute) => {
  if (!currentRoute) {
    return null;
  }

  // First route will always be a wildcard
  if (!parentRoute) {
    return `${currentRoute}*`;
  }

  const currentIsRootRoute = currentRoute === '/';
  const parentIsRootRoute = parentRoute === '/';

  // Only prefix non-root parent routes
  const routePrefix = (!parentIsRootRoute && parentRoute) || '';

  // Support "index" routes:
  // <Fragment forRoute='/home'>
  //   <Fragment forRoute='/'>
  //   </Fragment>
  // </Fragment>
  const routeSuffix =
    currentIsRootRoute && !parentIsRootRoute ? '' : currentRoute;

  const wildcard = currentIsRootRoute && parentIsRootRoute ? '' : '*';

  return `${routePrefix}${routeSuffix}${wildcard}`;
};

const shouldShowFragment = ({
  forRoute,
  withConditions,
  matcher,
  location
}) => {
  if (!forRoute) {
    return withConditions && withConditions(location);
  }

  const matchesRoute = matcher && matcher.match(location.pathname);

  return withConditions
    ? matchesRoute && withConditions(location)
    : matchesRoute;
};

export class FragmentComponent extends Component {
  constructor(props) {
    super(props);

    const currentRoute = resolveCurrentRoute(props.parentRoute, props.forRoute);

    this.matcher = (currentRoute && new UrlPattern(currentRoute)) || null;
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    if (this.props.forRoute !== prevProps.forRoute) {
      throwError('Updating route props is not yet supported')();
    }
  }

  render() {
    const { matcher } = this;
    const {
      children,
      forRoute,
      withConditions,
      forNoMatch,
      location,
      parentRoute,
      parentId
    } = this.props;

    const shouldShow = shouldShowFragment({
      forRoute,
      withConditions,
      matcher,
      location
    });

    // When Fragment rerenders, matchCache can get out of sync.
    // Blow it away at the root Fragment on every render.
    if (!parentId) { matchCache.clear(); }

    if (!shouldShow && !forNoMatch) {
      return null;
    }

    const currentRoute = resolveCurrentRoute(parentRoute, forRoute);

    if (parentId) {
      const previousMatch = matchCache.get(parentId);
      if (previousMatch && previousMatch !== currentRoute) {
        return null;
      } else {
        matchCache.add(parentId, currentRoute);
      }
    }

    return Children.only(children);
  }
}

export const withIdAndContext = compose(
  getContext({
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  }),
  withId,
  withContext(
    {
      parentRoute: PropTypes.string,
      parentId: PropTypes.string
    },
    props => ({
      parentRoute: resolveChildRoute(props.parentRoute, props.forRoute),
      parentId: props.id
    })
  )
);

function mapStateToProps(state) {
  return { location: state.router }
}

export default compose(
  connect(mapStateToProps),
  withIdAndContext
)(FragmentComponent);
