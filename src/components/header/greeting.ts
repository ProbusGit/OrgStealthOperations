// import i18n from '../../../i18n';
// import images from './asset/images';

// interface GreetingData {
//   message: string;
//   image: string;
// }

// function greetUser() {
//   const { morning, afternoon, evening, night } = images;
//   const currentTime = new Date();
//   const currentHour = currentTime.getHours();
//   let greeting;
//   let image;

//   if (currentHour < 5) {
//     greeting = i18n.t('greeting.night');
//     image = night;
//   } else if (currentHour < 12) {
//     greeting = i18n.t('greeting.morning');
//     image = morning;
//   } else if (currentHour < 18) {
//     greeting = i18n.t('greeting.afternoon');
//     image = afternoon;
//   } else {
//     greeting = i18n.t('greeting.evening');
//     image = evening;
//   }

//   return { message: greeting, image };
// }
// export default greetUser;
