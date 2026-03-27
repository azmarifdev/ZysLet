import React from "react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {FaRegCalendarAlt} from "react-icons/fa";

interface CalendarFormProps {
    courseData: {publish_date: any};
    setCourseData: any;
}

const CalendarForm: React.FC<CalendarFormProps> = ({
    courseData,
    setCourseData,
}) => {
    const handleSelectDate = (date: any) => {
        setCourseData({...courseData, publish_date: date});
    };

    return (
        <Popover>
            <PopoverTrigger className="w-full input-field">
                <div className="flex items-center justify-between w-full">
                    <p className="text-[#464646]">
                        {courseData.publish_date
                            ? format(
                                  new Date(courseData.publish_date),
                                  "MMMM d, yyyy"
                              )
                            : "Select a date"}
                    </p>
                    <FaRegCalendarAlt className="text-primary" size={16} />
                </div>
            </PopoverTrigger>
            <PopoverContent
                align="center"
                className="bg-white border-[#CFD2E1] ">
                <Calendar
                    mode="single"
                    selected={courseData.publish_date}
                    onSelect={handleSelectDate}
                    disabled={(date) => {
                        const today = new Date();
                        return date < new Date(today.setHours(0, 0, 0, 0));
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};

export default CalendarForm;
