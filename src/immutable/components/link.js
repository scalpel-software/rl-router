import { connect } from 'react-redux';

import {
  LinkComponent,
  PersistentQueryLinkComponent,
  mapDispatchToProps
} from '../../components/link';

import propsToJS from './props-to-js';

function mapState(state) {
  return { location: state.get('router') }
}

const withLocation = connect(mapState, mapDispatchToProps);

const LinkWithLocation = withLocation(propsToJS(LinkComponent));

const PersistentQueryLinkWithLocation = withLocation(
  propsToJS(PersistentQueryLinkComponent)
);

export {
  LinkWithLocation as ImmutableLink,
  PersistentQueryLinkWithLocation as ImmutablePersistentQueryLink
};
