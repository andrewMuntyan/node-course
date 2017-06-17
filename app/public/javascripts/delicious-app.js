import '../sass/style.scss';

import typeAhead from './modules/typeAhead'

import { $, $$ } from './modules/bling'; // eslint-disable-line
import autocomplete from './modules/autocomplete';

autocomplete( $('#address'), $('#lat'), $('#lng') );

typeAhead($('.search'))
