import '../sass/style.scss';

import { $, $$ } from './modules/bling'; // eslint-disable-line
import autocomplete from './modules/autocomplete';

autocomplete( $('#address'), $('#lat'), $('#lng') );
