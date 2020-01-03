import { connect } from 'react-redux';

import { FragmentComponent, withIdAndContext } from '../../components/fragment';
import propsToJS from './props-to-js';

function mapState(state) {
  return { location: state.get('router') }
}

export default connect(mapState)(withIdAndContext(propsToJS(FragmentComponent)));
