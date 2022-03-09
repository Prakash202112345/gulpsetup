let isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
window.onresize = function(event) {
    isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
};

$(document).ready(function() {
    $("#bank_details").hide();
    $("#filter-box").hide();

    $("#getshg_data").on('click', function() {
        $("#bank_details").show();

    });

    $("#filter").on('click', function() {
        $("#filter-box").toggle();

    });



})


$(document).ready(function() {
    $('#marketplace_data').DataTable({
        "search": {
            "search": ""
        }
    });
});

$(document).ready(function() {
    $('#direct_bank').DataTable({
        dom: 'Bfrtip',
        columnDefs: [{
            targets: 1,
            className: 'noVis',


        }],
        buttons: [{
            extend: 'colvis',
            columns: ':not(.noVis)',
        }]
    });
    // Setup - add a text input to each header cell
    $('#direct_bank .filter .filter_input').each(function() {
        var title = $(this).text();
        $(this).html('<input type="text" class="form-control"   placeholder="Search ' + title + '" />');
    });

    // DataTable
    var table = $('#direct_bank').DataTable();

    // Apply the search
    table.columns().every(function() {


        var that = this;

        $('input', this.header()).on('keypress change', function(e) {
            var keycode = e.which;
            //launch search action only when enter is pressed
            if (keycode == '13') {
                console.log('enter key pressed !')
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            }

        });
    });
});