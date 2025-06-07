import React from "react";
import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import HighlightText from "../Components/core/HomePage/HighlightText";
import CTAButton from '../Components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from "../Components/core/HomePage/CodeBlocks";
import ExploreMore from "../Components/core/HomePage/ExploreMore";
import TimelineSection from "../Components/core/HomePage/TimelineSection"
import LearningLanguageSection from "../Components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../Components/core/HomePage/InstructorSection";
import ReviewSlider from "../Components/common/ReviewSlider";
import Footer from "../Components/common/Footer";


const Home = () => {
    return (
        <div  >

            <div className="w-10/12 mx-auto  relative flex flex-col items-center   justify-between text-white">
                {/* {section 1} */}

                {/* Button */}
                <Link to={'/signup'}>
                    <div className=" group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration-200 group-hover:bg-richblack-900 ">
                            <p>Become an indtructor</p>
                            <GoArrowRight />

                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl font-semibold mt-7 text-white " >
                    Empower Your Future with
                    <HighlightText text={"Coding Skills"} />
                </div>

                <div className=' mt-4 w-[75%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>


                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkto={'/signup'}>Learn more</CTAButton>

                    <CTAButton active={false} linkto={'/login'}>Book a Demo</CTAButton>
                </div>

                <div className='  mx-3 my-12 w-[90%] shadow-[25px_25px_0_white,-1px_-5px_35px_rgba(15,122,157)]   '>

                    <video muted autoPlay loop >
                        <source src={Banner} ></source>

                    </video>

                </div>


                {/* Code Section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your
                                <HighlightText text={"coding potential"} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={
                            {
                                btnText: "try it yourself",
                                linkto: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "learn more",
                                linkto: "/login",
                                active: false,
                            }
                        }

                        codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\n`}
                        codeColor={"text-yellow-25"}
                    />
                </div>

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your
                                <HighlightText text={"coding potential"} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={
                            {
                                btnText: "try it yourself",
                                linkto: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "learn more",
                                linkto: "/login",
                                active: false,
                            }
                        }

                        codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\n`}
                        codeColor={"text-blue-25"}
                    />
                </div>



                <ExploreMore />

            </div>




            {/* {section 2} */}

            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='homepage_bg h-[310px]'>

                    <div className='w-11/12  flex flex-col items-center justify-between gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white '>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-3' >
                                    Explore Full Catalog
                                    <GoArrowRight />
                                </div>

                            </CTAButton>
                            <CTAButton active={false} linkto={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>
                        </div>

                    </div>


                </div>

                <div className='mx-auto w-10/12  flex flex-col items-center justify-between gap-7 '>

                    <div className='flex flex-row gap-10 mb-10 mt-[95px]  justify-center'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the Skills you need for a
                            <HighlightText text={"Job that is in demand"} />
                        </div>

                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>
                        </div>

                    </div>



                    <TimelineSection />

                    <LearningLanguageSection />

                </div>



            </div>





            {/* {section 3} */}

            
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

                <InstructorSection />

                <h2 className='text-center text-4xl font-semobold mt-10'>Reviews from students</h2>
                {/* Review Slider here */}
                <ReviewSlider/>
            </div>


            {/* {footer} */}
            <Footer/>



        </div>
    )
}
export default Home