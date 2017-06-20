import '../sass/style.scss';

import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

import { $, $$ } from './modules/bling'; // eslint-disable-line
import autocomplete from './modules/autocomplete';

autocomplete( $('#address'), $('#lat'), $('#lng') );

typeAhead($('.search'));

try {
  makeMap($('#map'));
} catch (err) {
  console.error(err);  // eslint-disable-line
}
