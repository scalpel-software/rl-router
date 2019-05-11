import { connect } from 'react-redux';
import { compose } from 'recompose';

import { FragmentComponent, withIdAndContext } from '../../components/fragment';
import propsToJS from './props-to-js';

function mapState(state) {
  return { location: state.get('router') }
}

export default compose(connect(mapState), withIdAndContext, propsToJS)(
  FragmentComponent
);
