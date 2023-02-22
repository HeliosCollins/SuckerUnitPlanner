import React, {useEffect} from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, snackbar, setOptions, Popup, Button, Input, Textarea, Switch, Datepicker, SegmentedGroup, SegmentedItem } from '@mobiscroll/react';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const defaultEvents = JSON.parse(localStorage.getItem('events')) || [];
const myResources = [{
    id: 1,
    name: 'Sucker Unit 1',
    color: '#ffeb3c'
}, {
    id: 2,
    name: 'Sucker Unit 2',
    color: '#f44437'
}, {
    id: 3,
    name: 'Sucker Unit 3',
    color: '#3f51b5'
}, {
    id: 4,
    name: 'Sucker Unit 4',
    color: '#4baf4f'
}, {
    id: 5,
    name: 'Sucker Unit 5',
    color: '#ff9900'
}];
const viewSettings = {
    timeline: { type: 'year' }
};
const responsivePopup = {
    medium: {
        display: 'anchored',
        width: 400,
        fullScreen: false,
        touchUi: false
    }
};
const colorPopup = {
    medium: {
        display: 'anchored',
        touchUi: false,
        buttons: []
    }
}
const colors = ['#ffeb3c', '#ff9900', '#f44437', '#ea1e63', '#9c26b0', '#3f51b5', '#5ac8fa', '#009788', '#4baf4f', '#7e5d4e'];

function App() {
    const [myEvents, setMyEvents] = React.useState(defaultEvents);
    const [tempEvent, setTempEvent] = React.useState(null);
    const [isOpen, setOpen] = React.useState(false);
    const [isEdit, setEdit] = React.useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [start, startRef] = React.useState(null);
    const [end, endRef] = React.useState(null);
    const [popupEventTitle, setTitle] = React.useState('');
    const [popupEventDescription, setDescription] = React.useState('');
    const [popupEventAllDay, setAllDay] = React.useState(true);
    const [popupEventDate, setDate] = React.useState([]);
    const [popupEventStatus, setStatus] = React.useState('busy');
    const [mySelectedDate, setSelectedDate] = React.useState(new Date());
    const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
    const [colorAnchor, setColorAnchor] = React.useState(null);
    const [selectedColor, setSelectedColor] = React.useState('');
    const [tempColor, setTempColor] = React.useState('');
    const colorPicker = React.useRef();
    const colorButtons = React.useMemo(() => [
        'cancel',
        {
            text: 'Set',
            keyCode: 'enter',
            handler: () => {
                setSelectedColor(tempColor);
                setColorPickerOpen(false);
            },
            cssClass: 'mbsc-popup-button-primary'
        }
    ], [tempColor]);

    const saveEvent = React.useCallback(() => {
        const newEvent = {
            id: tempEvent.id,
            title: popupEventTitle,
            description: popupEventDescription,
            start: popupEventDate[0],
            end: popupEventDate[1],
            allDay: true,
            status: popupEventStatus,
            color: selectedColor,
            resource: tempEvent.resource
        };
        if (isEdit) {
            // update the event in the list
            const index = myEvents.findIndex(x => x.id === tempEvent.id);;
            const newEventList = [...myEvents];
            newEventList.splice(index, 1, newEvent);
            setMyEvents(newEventList);
            // here you can update the event in your storage as well
            localStorage.setItem('events', JSON.stringify(newEventList));
            console.log("IF SECTION");
        } else {
            console.log("ELSE SECTION");
            // add the new event to the list
            const startdate = new Date(newEvent.start);
            startdate.setHours(startdate.getHours() + 13);
            const startisoString = startdate.toISOString();

            const enddate = new Date(newEvent.end);
            enddate.setHours(enddate.getHours() + 13);
            const endisostring = enddate.toISOString();

            newEvent.end = endisostring;
            newEvent.start = startisoString;


            setMyEvents([...myEvents, newEvent]);

            


// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.
            


            localStorage.setItem('events', JSON.stringify([...myEvents, newEvent]));
            // here you can add the event to your storage as well
            // ...
        }
        setSelectedDate(popupEventDate[0]);
        // close the popup
        setOpen(false);
    }, [isEdit, myEvents, popupEventAllDay, popupEventDate, popupEventDescription, popupEventStatus, popupEventTitle, tempEvent, selectedColor]);

    useEffect(() => {
        console.log("Events Updated to: ", myEvents.length);
}, [myEvents])
    

    const deleteEvent = React.useCallback((event) => {
        const updatedEvents = myEvents.filter((e) => e.id !== event.id);

        // save the updated event list to local storage
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // set the updated event list in state
        setMyEvents(updatedEvents);

        setMyEvents(myEvents.filter(item => item.id !== event.id));
        setTimeout(() => {
            snackbar({
                button: {
                    action: () => {
                        setMyEvents(prevEvents => [...prevEvents, event]);

                        localStorage.setItem('events', JSON.stringify([...myEvents, event]));
                    },
                    text: 'Undo'
                },
                message: 'Event deleted'
            });
        });
    }, [myEvents]);

    const loadPopupForm = React.useCallback((event) => {
        setTitle(event.title);
        setDescription(event.description);
        setDate([event.start, event.end]);
        setAllDay(event.allDay || false);
        setStatus(event.status || 'busy');
    }, []);

    // handle popup form changes

    const titleChange = React.useCallback((ev) => {
        setTitle(ev.target.value);
    }, []);

    const descriptionChange = React.useCallback((ev) => {
        setDescription(ev.target.value);
    }, []);

    const allDayChange = React.useCallback((ev) => {
        setAllDay(ev.target.checked);
    }, []);

    const dateChange = React.useCallback((args) => {
        setDate(args.value);
    }, []);

    const statusChange = React.useCallback((ev) => {
        setStatus(ev.target.value);
    }, []);

    const onDeleteClick = React.useCallback(() => {
        deleteEvent(tempEvent);
        setOpen(false);
    }, [deleteEvent, tempEvent]);

    // scheduler options

    const onSelectedDateChange = React.useCallback((event) => {
        setSelectedDate(event.date);
    }, []);

    const onEventClick = React.useCallback((args) => {
        setEdit(true);
        setTempEvent({ ...args.event });
        setSelectedColor(args.event.color || myResources.find(r => r.id === args.event.resource).color);
        // fill popup form with event data
        loadPopupForm(args.event);
        setAnchor(args.domEvent.target);
        setOpen(true);
    }, [loadPopupForm]);

    const onEventCreated = React.useCallback((args) => {
        setEdit(false);
        setTempEvent(args.event)
        setSelectedColor(myResources.find(r => r.id === args.event.resource).color);
        // fill popup form with event data
        loadPopupForm(args.event);
        setAnchor(args.target);
        // open the popup
        setOpen(true);
    }, [loadPopupForm]);

    const onEventDeleted = React.useCallback((args) => {
        deleteEvent(args.event)



    }, [deleteEvent]);

    const onEventUpdated = React.useCallback((args) => {
        console.log("Updating");
        console.log(myEvents.length);
        console.log(args.event.resource);
        // // Find the index of the updated event in the events array
        for (let i = 0; i < myEvents.length; i++) {
            if (myEvents[i].id === args.event.id) {
                const startdate = new Date(args.event.start);
                startdate.setHours(startdate.getHours() + 13);
                const startisoString = startdate.toISOString();

                const enddate = new Date(args.event.end);
                enddate.setHours(enddate.getHours() + 13);
                const endisoString = enddate.toISOString();

                myEvents[i] = {
                    id: i,
                    title: args.event.title,
                    description: args.event.description,
                    allDay: args.event.allDay,
                    color: args.event.color,
                    start: startisoString,
                    end: endisoString,
                    resource: args.event.resource
                };
            }
        }
        
        localStorage.setItem('events', JSON.stringify(myEvents));
      }, [myEvents]);

    // datepicker options
    const controls = React.useMemo(() => popupEventAllDay ? ['date'] : ['datetime'], [popupEventAllDay]);
    const responsiveOptions = React.useMemo(() => popupEventAllDay ? {
        medium: {
            controls: ['calendar'],
            touchUi: false
        }
    } : {
            medium: {
                controls: ['calendar', 'time'],
                touchUi: false
            }
        }, [popupEventAllDay]);

    // popup options
    const headerText = React.useMemo(() => isEdit ? 'Edit event' : 'New Event', [isEdit]);
    const popupButtons = React.useMemo(() => {
        if (isEdit) {
            return ['cancel', {
                handler: () => {
                    saveEvent();
                },
                keyCode: 'enter',
                text: 'Save',
                cssClass: 'mbsc-popup-button-primary'
            }];
        } else {
            return ['cancel', {
                handler: () => {
                    saveEvent();
                },
                keyCode: 'enter',
                text: 'Add',
                cssClass: 'mbsc-popup-button-primary'
            }];
        }
    }, [isEdit, saveEvent]);

    const onClose = React.useCallback(() => {
        if (!isEdit) {
            // refresh the list, if add popup was canceled, to remove the temporary event
            setMyEvents([...myEvents]);
        }
        setOpen(false);
    }, [isEdit, myEvents]);

    const selectColor = React.useCallback((color) => {
        setTempColor(color)
    }, []);

    const openColorPicker = React.useCallback((ev) => {
        selectColor(selectedColor);
        setColorAnchor(ev.currentTarget);
        setColorPickerOpen(true);
    }, [selectColor, selectedColor]);

    const changeColor = React.useCallback((ev) => {
        const color = ev.currentTarget.getAttribute('data-value');
        selectColor(color);
        if (!colorPicker.current.s.buttons.length) {
            setSelectedColor(color);
            setColorPickerOpen(false);
        }
    }, [selectColor, setSelectedColor]);

    const onPickerClose = React.useCallback(() => {
        setColorPickerOpen(false);
    }, []);

    return <div>
        <Eventcalendar
            view={viewSettings}
            data={myEvents}
            resources={myResources}
            clickToCreate="double"
            dragToCreate={true}
            dragToMove={true}
            dragToResize={true}
            selectedDate={mySelectedDate}
            onSelectedDateChange={onSelectedDateChange}
            onEventClick={onEventClick}
            onEventCreated={onEventCreated}
            onEventDeleted={onEventDeleted}
            onEventUpdated={onEventUpdated}
        />
        <Popup
            display="bottom"
            fullScreen={true}
            contentPadding={false}
            headerText={headerText}
            anchor={anchor}
            buttons={popupButtons}
            isOpen={isOpen}
            onClose={onClose}
            responsive={responsivePopup}
        >
            <div className="mbsc-form-group">
                <Input label="Title" value={popupEventTitle} onChange={titleChange} />
                <Textarea label="Description" value={popupEventDescription} onChange={descriptionChange} />
            </div>
            <div className="mbsc-form-group">
                <Switch label="All-day" checked={popupEventAllDay} onChange={allDayChange} />
                <Input ref={startRef} label="Starts" />
                <Input ref={endRef} label="Ends" />
                <Datepicker
                    select="range"
                    controls={controls}
                    touchUi={true}
                    startInput={start}
                    endInput={end}
                    showRangeLabels={false}
                    responsive={responsiveOptions}
                    onChange={dateChange}
                    value={popupEventDate}
                />
                <div onClick={openColorPicker} className="event-color-c">
                    <div className="event-color-label">Color</div>
                    <div className="event-color" style={{ background: selectedColor }}></div>
                </div>
                <SegmentedGroup onChange={statusChange}>
                    <SegmentedItem value="busy" checked={popupEventStatus === 'busy'}>Show as busy</SegmentedItem>
                    <SegmentedItem value="free" checked={popupEventStatus === 'free'}>Show as free</SegmentedItem>
                </SegmentedGroup>
                {isEdit && <div className="mbsc-button-group">
                    <Button className="mbsc-button-block" color="danger" variant="outline" onClick={onDeleteClick}>Delete event</Button>
                </div>}
            </div>
        </Popup>
        <Popup
            display="bottom"
            contentPadding={false}
            showArrow={false}
            showOverlay={false}
            anchor={colorAnchor}
            isOpen={colorPickerOpen}
            buttons={colorButtons}
            responsive={colorPopup}
            ref={colorPicker}
            onClose={onPickerClose}
        >
            <div className="crud-color-row">
                {colors.map((color, index) => {
                    if (index < 5) {
                        return <div key={index} onClick={changeColor} className={"crud-color-c " + (tempColor === color ? 'selected' : '')} data-value={color}>
                            <div className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check" style={{ background: color }}></div>
                        </div>
                    } else return null;
                })}
            </div>
            <div className="crud-color-row">
                {colors.map((color, index) => {
                    if (index >= 5) {
                        return <div key={index} onClick={changeColor} className={"crud-color-c " + (tempColor === color ? 'selected' : '')} data-value={color}>
                            <div className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check" style={{ background: color }}></div>
                        </div>
                    } else return null;
                })}
            </div>
        </Popup>
    </div>
}

export default App;