import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PastInterviewsTable from "@/components/PastInterviewsTable";
import serverComponentFetchRequest from "@/services/serverComponentFetchRequest";
import MaintenancePage from "@/components/exception/MaintainancePage";
import { InitDataInterviewPayloadModel } from "@/models/interview/init/InterviewPayloadModel";
import { ExceptionResponseModel } from "@/models/global/ExceptionResponseModel";
import { SuccessfulResponseModel } from "@/models/global/SuccessResponseModel";
import { UserSpecificInterviewsPayloadModel } from "@/models/interview/specific/UserSpecificInterviewPayloadModel";
import UpcomingInterviewSection from "@/components/UpcomingInterviewSection";

const fetchInitData = async (): Promise<SuccessfulResponseModel | ExceptionResponseModel> => {
    const response = await serverComponentFetchRequest(`users/init_data`);
    return response ; 
};

const fetchSpecificData = async (): Promise<SuccessfulResponseModel | ExceptionResponseModel> => {
  const response = await serverComponentFetchRequest(`users/specific`);
  return response;
};

const Home = async () => {
  const data = await fetchInitData();
  const specificData = await fetchSpecificData(); 

  if ("error" in data || "error" in specificData) {
    return <MaintenancePage />;
  }
  else{
    const specificPayload = specificData.payload as UserSpecificInterviewsPayloadModel;
    
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <HeroSection data={data.payload as InitDataInterviewPayloadModel} />
        <UpcomingInterviewSection data={specificPayload.upcomingInterviews} />
        <PastInterviewsTable data={specificPayload.pastInterviews}   />
      </div>
    );
  }
};

export default Home;
