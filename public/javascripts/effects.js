
function headertimeot() {
    $('#mainheader')
        .css({opacity: 0, top: -250, textAlign: 'center'})
        .slideDown('slow')
        .animate(
            {opacity: 1, textAlign: 'center', position: 'relative', top: 0, queue: false, duration: 1000}
        );
}
headertimeot();





