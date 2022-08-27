import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector('input#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');
let timer = null;

startBtn.disabled =  true;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => String(value).padStart(2, 0);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notify.failure('Please choose a date in the future');
      return;
    }

    startBtn.disabled = false;

    const startTimer = () => {
      localStorage.setItem('selectedData', selectedDates[0]);
      const selectData = new Date(localStorage.getItem('selectedData'));

      if (!selectData) return;

      const { days, hours, minutes, seconds } = convertMs(selectData - new Date());
      daysValue.textContent = days;
      hoursValue.textContent = addLeadingZero(hours);
      minutesValue.textContent = addLeadingZero(minutes);
      secondsValue.textContent = addLeadingZero(seconds);

      if (
        daysValue.textContent === '0' &&
        hoursValue.textContent === '00' &&
        minutesValue.textContent === '00' &&
        secondsValue.textContent === '00'
      ) {
        clearInterval(timer);
      }
    };

    const onClick = () => {
      if (timer) {
        clearInterval(timer);
      }
      startTimer();
      timer = setInterval(startTimer, 1000);
    };

    startBtn.addEventListener('click', onClick);
  },
};

flatpickr(input, { ...options });
