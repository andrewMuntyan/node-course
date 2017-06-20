import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
  e.preventDefault();
  // 'this' reffers to form here
  const heartBtn = this.heart;
  const flyingHeartClass = 'heart__button--float';
  axios
    .post(this.action)
    .then(res => {
      const { data: { hearts } } = res;
      const isHearted = heartBtn.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = hearts.length;
      if (isHearted) {
        heartBtn.classList.add(flyingHeartClass);
        setTimeout(() => heartBtn.classList.remove(flyingHeartClass), 2500);
      }
    })
    .catch(console.error); //eslint-disable-line
}

export default ajaxHeart;