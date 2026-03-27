import {IoMdNotifications} from "react-icons/io";
import {Popover, PopoverTrigger, PopoverContent} from "../../ui/popover";

function Notification() {
    return (
        <Popover>
            <PopoverTrigger className="relative">
                <IoMdNotifications size={32} className="text-black" />{" "}
                <span className="text-[#D91313] h-4 w-4 bg-white  rounded-full absolute flex items-center justify-center top-0.5 right-1 text-xs">
                    0
                </span>
            </PopoverTrigger>
            <PopoverContent
                align="center"
                className="bg-white border-slate-400 z-[999999] w-[400px] mt-5 overflow-y-auto">
                {/* {notifications?.data?.length ? (
                    <>
                        {notifications?.data?.map((noti: any) => (
                            <div
                                key={noti?._id}
                                className="mb-2 hover:bg-[#dfe3fa] rounded-md">
                                <div className="p-2">
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={
                                                noti?.userId?.profile_pic ||
                                                avatar
                                            }
                                            width={50}
                                            height={50}
                                            className="h-12 w-12 rounded-full"
                                            alt="avatar"
                                        />
                                        <div className="leading-5 flex w-full justify-between">
                                            <div>
                                                <h2 className="text-base text-black">
                                                    {getFullName(noti?.userId)}
                                                </h2>
                                                <p className="text-sm text-gray">
                                                    {timeAgo(noti?.createdAt)}
                                                </p>
                                            </div>

                                            <div>
                                                {noti.status == "read" ? (
                                                    <p className="text-sm text-gray">
                                                        read
                                                    </p>
                                                ) : (
                                                    <p
                                                        onClick={() =>
                                                            handleReadNotification(
                                                                noti?._id
                                                            )
                                                        }
                                                        className="text-sm cursor-pointer text-white rounded px-2 py-0.5 bg-[#D91313] ">
                                                        Mark as read
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-base text-gray leading-4 mt-1 ml-12">
                                        {noti?.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                ) : ( */}
                <p className="text-center text-red-500">
                    No new notification available
                </p>
                {/* )} */}
            </PopoverContent>
        </Popover>
    );
}

export default Notification;
