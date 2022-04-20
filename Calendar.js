import { getDayIndex,addDays,dateString} from "./helper.js";
/* creating enum */
const MODE = {
    VIEW: 1,
    UPDATE:2,
    CREATE:3
};

export class Calendar{
    constructor(){

      this.weekStart = null;
      this.weekEnde = null;
      this.weekOffSet = 0;
      this.mode = MODE.VIEW;
      
    }
    setup(){
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.showWeek();
        this.setupControls();
    }
    setupTimes(){
        const header = $("<div></div>").addClass("columnHeader");
        const slots = $("<div></div>").addClass("slots");
        for(let hour = 0; hour < 24 ; hour++){
            $("<div></div>")
            .attr("data-hour",hour)
            .addClass("time")
            .text(`${hour}:00 - ${hour+1}:00`)
            .appendTo(slots);
        }
        $(".dayTime").append(header).append(slots);
    }
    setupDays(){
        const cal = this;
        $(".day").each(function(){
          const dayIndex = parseInt($(this).attr("data-dayIndex"));
          const name = $(this).attr("data-name");
          const header = $("<div></div>").addClass("columnHeader").text(name);
          $("<div></div>").addClass("dayDisplay").appendTo(header);
          const slots = $("<div></div>").addClass("slots");
          $("<div></div>").addClass("dayDisplay").appendTo(header);
          for(let hour = 0; hour< 24 ; hour++){
            $("<div></div>")
            .attr("data-hour", hour)
            .appendTo(slots)
            .addClass("slot")
            .click(()=> cal.clickSlot(hour, dayIndex))
            .hover(
                () => cal.hoverOver(hour),
                () => cal.hoverOut()
            );
          }
          $(this).append(header).append(slots);

        });
    }
    clickSlot(hour,dayIndex){
        if(this.mode != MODE.VIEW)
        return;
        this.mode = MODE.CREATE;
        const start = hour.toString().padStart(2,"0") + ":00";
        const end = hour < 23 ? (hour+1).toString().padStart(2,"0")+ ":00" : hour.toString().padStart(2,"0") + ":59";
        const date = dateString(addDays(this.weekStart,dayIndex));
        const event = new Event({
             start,
             end,
             date,
             title: "",
             description: "",
             color: "red",
        });
        this.openModal(event);
    }
    openModal(event){
        $("#modalTitle").text(this.mode == MODE.CREATE ? "Create a new event": "Update your event");
        $("#eventModal").fadeIn(200);
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventDescription").val(event.description);
        $(".color").removeClass("active");
        $(`.color[data-color=${event.color}]`).addClass("active");
        $("#eventTitle").val(event.title);

    }
    hoverOver(hour){
    $(`.time[data-hour=${hour}]`).addClass("currentTime");
    }
    hoverOut(){
        $(".time").removeClass("currentTime");
    }
    calculateCurrentWeek(){
        const now = new Date();
        this.weekStart = addDays(now, -getDayIndex(now));
        this.weekEnd = addDays(this.weekStart,6);
    }
    showWeek(){
        const options = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",

        };
        $("#weekStartDisplay").text(this.weekStart.toLocaleDateString(undefined,options));
        $("#weekEndDisplay").text(this.weekEnd.toLocaleDateString(undefined,options));
        for(let dayIndex = 0; dayIndex < 7; dayIndex++){
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString(undefined,{
                month: "2-digit",
                day: "2-digit",
            });
            $(`.day[data-dayIndex=${dayIndex}] .dayDisplay`).text(display);
        }
        if(this.weekOffSet == 0){
            this.showCurrentDay();
        }else{
            this.hideCurrentDay();
        }
    }
    setupControls(){
        $("#nextWeekBtn").click(()=> this.changeWeek(1));
        $("#prevWeekBtn").click(()=> this.changeWeek(-1));
    }
    changeWeek(number){
      this.weekOffSet += number;  
      this.weekStart = addDays(this.weekStart, 7*number);
      this.weekEnd = addDays(this.weekStart, 7*number);
      this.showWeek();
    }
    showCurrentDay(){
      const now = new Date();
      const dayIndex = getDayIndex(now);
      $(`.day[data-dayIndex=${dayIndex}`).addClass("currentDay");
    }
    hideCurrentDay(){
     $(".day").removeClass("currentDay"); 
    }


}