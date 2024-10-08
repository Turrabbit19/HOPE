
if($('#events').length > 0) {
    document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('events');		
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth', 
          events: [
            {
              title: 'Summer Vacation',
              className: 'progress-danger',
              backgroundColor: '#FDE9ED',
              start: new Date($.now() - 168000000).toJSON().slice(0, 10)
            },
            {
                title: 'Parents, Teacher Meet',	
                className: 'progress-info',
                backgroundColor: '#E7F1FC' ,				  
                start: new Date($.now() + 338000000).toJSON().slice(0, 10)
            },
            {
                title: 'Admission Camp',
                className: 'progress-pending',
                backgroundColor: '#E6F9FF',				  
                start: new Date($.now() - 338000000).toJSON().slice(0, 10) 
            },
            {
                title: 'Activity -  Training',
                className: 'progress-success',
                backgroundColor: '#E8F9E8',		  
                start: new Date($.now() + 68000000).toJSON().slice(0, 10) 
              }
          ],
          headerToolbar: {
            start: 'title',
            center: 'dayGridMonth,dayGridWeek,dayGridDay',
            end: 'custombtn'
          }, 
          customButtons: {
            custombtn: {
                text: 'Add New Event',
                click: function() {
                    var myModal = new bootstrap.Modal(document.getElementById('add_event'));
                    myModal.show();
                }
            }
        },
        eventClick: function(info) {						
            var modalTitle = document.getElementById('eventTitle');                
            modalTitle.textContent = info.event.title;

            var eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
            eventModal.show();					
        }
        });		
        calendar.render();
    });			
}



if($('#calendar').length > 0) {

    document.addEventListener('DOMContentLoaded', function() {
        var todayDate = moment().startOf('day');
        var YM = todayDate.format('YYYY-MM');
        var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
        var TODAY = todayDate.format('YYYY-MM-DD');
        var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },

            height: 500,
            contentHeight: 580,
            aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio


            views: {
                dayGridMonth: { buttonText: 'month' },
                timeGridWeek: { buttonText: 'week' },
                timeGridDay: { buttonText: 'day' }
            },

            initialView: 'dayGridMonth',
            initialDate: TODAY,

            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            navLinks: true,
            events: [
                {
                    title: 'All Day Event',
                    start: new Date($.now() - 168000000).toJSON().slice(0, 10),
                    backgroundColor: '#FDE9ED'
                },
                {
                    id: 1000,
                    title: 'Repeating Event',
                    start: new Date($.now() - 338000000).toJSON().slice(0, 10) 
                },
                {
                    title: 'Meeting',
                    start: new Date($.now() - 338000000).toJSON().slice(0, 10)
                },
                {
                    title: 'Click for Google',
                    start: new Date($.now() + 68000000).toJSON().slice(0, 10),
                    className: "bg-secondary text-white" 
                }
            ]
        });

        calendar.render();
    });
}
