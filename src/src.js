var socket = io('http://localhost:3003/');
var totalItems = 0;
var maxItems = 50;

socket.on('tweet', function (data) {
    console.log('>>>', data);
    function updateData() {
        if (totalItems === maxItems) {
            totalItems = 0;
            reset();
        }
        // createItem(data.text, false);
        createLogo('/images/football.png', data.text);
        totalItems++;
    }
    updateData();
});
