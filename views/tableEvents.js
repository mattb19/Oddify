document.getElementById('activateSlider').addEventListener('click', function() {
    document.getElementById('sliderContainer').style.display = 'flex';
    document.getElementById('buttonContainer').style.display = 'none';
});
document.getElementById('betButton').addEventListener('click', function() {
    const value = document.getElementById('valueSlider').value;
    alert(`You bet: ${value}`);
});