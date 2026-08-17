// Show success popup alert
// title: alert title string
// message: alert description text
// calories: calorie number added
export function showSuccessAlert(title, message, calories) {
  window.Swal?.fire({
    icon: "success",
    title,
    html: `
      <p class="text-gray-500 text-lg">${message}</p>
      <span class="text-green-600 block font-bold text-lg">+${calories} calories</span>
    `,
    timer: 1500,
    showConfirmButton: false,
  });
}
