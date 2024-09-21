document.getElementById('activateSlider').addEventListener('click', function() {
    document.getElementById('sliderContainer').style.display = 'flex';
    console.log("Click!");
});
document.getElementById('betButton').addEventListener('click', function() {
    console.log('Click!');
    document.getElementById('sliderContainer').style.display = 'none';
    document.getElementById('buttonContainer').style.display = 'flex';
    const value = document.getElementById('valueSlider').value;
    console.log(`You bet ${value}!`);
});