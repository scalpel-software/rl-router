import compose from "../../util/compose";
import { connect } from 'react-redux';
import { FragmentComponent, withIdAndContext } from '../../components/fragment';
import propsToJS from './props-to-js';

function mapState(state) {
  return { location: state.get('router') }
}

export default compose(
  connect(mapState),
  withIdAndContext,
  propsToJS
)(FragmentComponent);
