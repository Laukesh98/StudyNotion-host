import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
// import "video-react/dist/video-react.css"
// import { BigPlayButton, Player } from "video-react"
import ReactPlayer from 'react-player';
import { useLocation } from "react-router-dom"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const playerRef = useRef(null)
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const { courseSectionData, courseEntireData, completedLectures } =
        useSelector((state) => state.viewCourse)
        console.log(completedLectures, ' at line no 21 in file video details ')
    const [videoData, setVideoData] = useState([])
    const [previewSource, setPreviewSource] = useState("")
    const [videoEnded, setVideoEnded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ; (async () => {
            if (!courseSectionData.length) return
            if (!courseId && !sectionId && !subSectionId) {
                navigate(`/dashboard/enrolled-courses`)
            } else {
                console.log("courseSectionData", courseSectionData)
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                )
                // console.log("filteredData", filteredData)
                const filteredVideoData = filteredData?.[0]?.subSection.filter(
                    (data) => data._id === subSectionId
                )
                // console.log("filteredVideoData", filteredVideoData)
                setVideoData(filteredVideoData[0])
                setPreviewSource(courseEntireData.thumbnail)
                setVideoEnded(false)
            }
        })()
    }, [courseSectionData, courseEntireData, location.pathname])

    // check if the lecture is the first video of the course
    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )
        console.log('L 59')

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSection.findIndex((data) => data._id === subSectionId)

        console.log('L 65')
        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true
        } else {
            console.log('L 69')
            return false
        }
    }

    // go to the next video
    const goToNextVideo = () => {
        // console.log(courseSectionData)

        console.log('L 78')
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubsections =
            courseSectionData[currentSectionIndex].subSection.length

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSection.findIndex((data) => data._id === subSectionId)

        // console.log("no of subsections", noOfSubsections)

        console.log('L 92')
        if (currentSubSectionIndex !== noOfSubsections - 1) {
            const nextSubSectionId =
                courseSectionData[currentSectionIndex].subSection[
                    currentSubSectionIndex + 1
                ]._id
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
            )
        } else {
            console.log('L 102')
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
            const nextSubSectionId =
                courseSectionData[currentSectionIndex + 1].subSection[0]._id
            navigate(
                `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
            )
        }
    }

    // check if the lecture is the last video of the course
    const isLastVideo = () => {
        console.log('L 114')
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubsections =
            courseSectionData[currentSectionIndex].subSection.length

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSection.findIndex((data) => data._id === subSectionId)

        console.log('L 126')
        if (
            currentSectionIndex === courseSectionData.length - 1 &&
            currentSubSectionIndex === noOfSubsections - 1
        ) {
            return true
        } else {
            console.log('L 133')
            return false
        }
    }

    // go to the previous video
    const goToPrevVideo = () => {
        // console.log(courseSectionData)

        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )
        console.log('L 146')
        console.log(courseSectionData)
        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSection.findIndex((data) => data._id === subSectionId)

        if (currentSubSectionIndex !== 0) {
            const prevSubSectionId =
                courseSectionData[currentSectionIndex].subSection[
                    currentSubSectionIndex - 1
                ]._id
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
            )
            console.log('L 159')
        } else {
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
            const prevSubSectionLength =
                courseSectionData[currentSectionIndex - 1].subSection.length
            const prevSubSectionId =
                courseSectionData[currentSectionIndex - 1].subSection[
                    prevSubSectionLength - 1
                ]._id
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
            )
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true)
        const res = await markLectureAsComplete(
            { courseId: courseId, subSectionId: subSectionId },
            token
        )
        if (res) {
            dispatch(updateCompletedLectures(subSectionId))
        }
        console.log('L 183')
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-5 text-white">
            {console.log('L 189', videoData)}
            {!videoData ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                <div style={{ position: "relative" }}>
                    <ReactPlayer
                        ref={playerRef}
                        onEnded={() => setVideoEnded(true)}
                        url={videoData?.videoURL}
                        controls
                        style={{ padding: 20 }}
                        width="100%"
                        height="100%"
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload',
                                    onContextMenu: e => e.preventDefault(),
                                },
                            },
                        }}
                    />
                    {console.log('L 206')}
                    {/* <BigPlayButton position="center" /> */}
                    {/* Render When Video Ends */}
                    {!videoEnded && (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                                color: "white",
                                fontSize: "3rem",
                                pointerEvents: "none"
                            }}
                        >

                        </div>
                    )}
                    {videoEnded && (
                        <div
                            style={{
                                backgroundImage:
                                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                            }}
                            className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                        >
                        
                            {!completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    disabled={loading}
                                    onclick={() => handleLectureCompletion()}
                                    text={!loading ? "Mark As Completed" : "Loading..."}
                                    customClasses="text-xl max-w-max px-4 mx-auto"
                                />
                            )}
                            {console.log('L 241')}
                            <IconBtn
                                disabled={loading}
                                onclick={() => {
                                    if (playerRef?.current) {
                                        // set the current time of the video to 0
                                        playerRef?.current?.seekTo(0, "seconds")
                                        setVideoEnded(false)
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                            />
                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                {!isFirstVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToPrevVideo}
                                        className="blackButton"
                                    >
                                        Prev
                                    </button>
                                )}
                                {!isLastVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToNextVideo}
                                        className="blackButton"
                                    >
                                        {console.log('L 270')}
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {console.log('L 281')}
            <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6">{videoData?.description}</p>
        </div>
    )
}

export default VideoDetails
// video
