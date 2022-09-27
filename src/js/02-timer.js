import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector('input#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');
let timerId = null;
let selectedDate = null;

startBtn.disabled = true;

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
      startBtn.disabled = true;
      return;
    }
    selectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(input, options);

const renderTimer = () => {
  if (!selectedDate) return;

  let currentTime = selectedDate - new Date();
  if (currentTime <= 0) {
    currentTime = 0;
    clearInterval(timerId);
  }
  const { days, hours, minutes, seconds } = convertMs(currentTime);
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
};

const onClick = () => {
  if (timerId) {
    clearInterval(timerId);
  }
  renderTimer();
  timerId = setInterval(renderTimer, 1000);
  startBtn.disabled = true;
};

startBtn.addEventListener('click', onClick);
