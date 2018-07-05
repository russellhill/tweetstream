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

        var image = null;

        if (data.filter === 'fifa') {
            image = 'football';
        } else if (data.filter === 'trump') {
            image = 'trump';
        }

        if (image) {
            createLogo('/images/' + image + '.png', data.text);
        } else {
            createItem(data.text, false);
        }
        totalItems++;
    }
    updateData();
});
