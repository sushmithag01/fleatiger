import { executeGET, executePost, executeTracker } from '../API/ServicesMethods';
import messaging from '@react-native-firebase/messaging';

// User-Validations
export const SignInApi = async data => {
  // console.log(data, "data")
  try {
    const SignIn = await executePost('/fleatiger/user/signin', data);
    const SignInData = SignIn.data ? SignIn.data : [];
    console.log(SignInData, 'SignInData');
    return SignInData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
export const SignUpApi = async data => {
  // console.log(data, "data")
  try {
    const SignUp = await executePost('/fleatiger/user/signup', data);
    const SignUpData = SignUp.data ? SignUp.data : [];
    console.log(SignUpData, 'SignUpData');
    return SignUpData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
export const ResetPasswordApi = async data => {
  // console.log(data, "data")
  try {
    const ResetPassword = await executePost(
      '/fleatiger/user/resetpassword',
      data,
    );
    const ResetPasswordData = ResetPassword.data ? ResetPassword.data : [];
    console.log(ResetPasswordData, 'SignUpData');
    return ResetPasswordData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
export const OtpApi = async data => {
  // console.log(data, "data")
  try {
    const Otp = await executePost('/fleatiger/user/validateotp', data);
    const OtpData = Otp.data ? Otp.data : [];
    // console.log(OtpData, "validateotp")
    return OtpData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
export const ForgotPasswordApi = async data => {
  // console.log(data, "data")
  try {
    const ForgotPassword = await executePost(
      '/fleatiger/user/forgotpassword',
      data,
    );
    const ForgotPasswordData = ForgotPassword.data ? ForgotPassword.data : [];
    console.log(ForgotPasswordData, 'forgotpassword');
    return ForgotPasswordData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// OTP - signup
export const OtpSignUpApi = async data => {
  try {
    const Otp = await executePost('/fleatiger/pets/verify_email_otp', data);
    const OtpData = Otp.data ? Otp.data : [];
    return OtpData;
  } catch (error) {
    return error;
  }
};

// resend-OTP-signUp
export const ResendOtpSignUpApi = async data => {
  try {
    const ResendOtp = await executePost(
      '/fleatiger/pets/resend_email_otp',
      data,
    );
    const ResendOtpData = ResendOtp.data ? ResendOtp.data : [];
    return ResendOtpData;
  } catch (error) {
    return error;
  }
};
// Slider - Pet-details-api
export const PetDetailsApi = async data => {
  try {
    const PetDetails = await executePost(
      '/fleatiger/pets/savePetDetails',
      data,
    );
    // console.log("PetDetails savePetDetails", PetDetails)
    const PetDetailsData = PetDetails.data ? PetDetails.data : [];
    return PetDetailsData;
  } catch (error) {
    console.log('PetDetailsApi error', error);
    return error;
  }
};
// Add-newPet -> Pet-details-api
export const AddNewPetDetailsApi = async data => {
  // console.log(data,"data")
  try {
    const AddNewPetDetails = await executePost(
      '/fleatiger/pets/savePetFamilyMemeberDetails',
      data,
    );
    const AddNewPetDetailsData = AddNewPetDetails.data
      ? AddNewPetDetails.data
      : [];
    // console.log(AddNewPetDetailsData,"AddNewPetDetails")
    return AddNewPetDetailsData;
  } catch (error) {
    console.log('AddNewPetDetailsApi error', error);
    return error;
  }
};
//onboard2 get bread dropdown data
export const GetBreadDropdownApi = async data => {
  // console.log(data,"data")
  try {
    const GetBreadDropdown = await executeGET(
      '/fleatiger/pets/breedCategory',
      data,
    );
    const GetBreadDropdownData = GetBreadDropdown.data
      ? GetBreadDropdown.data
      : [];
    // console.log(GetBreadDropdownData,"GetBreadDropdown")
    return GetBreadDropdownData;
  } catch (error) {
    console.log('GetBreadDropdownApi error', error);
    return error;
  }
};
//Dashboard
export const GetDashboardApi = async data => {
  // console.log(data,"data")
  try {
    const GetDashboard = await executePost('/fleatiger/pets/Dashboard', data);
    const GetDashboardData = GetDashboard.data ? GetDashboard.data : [];
    // console.log(GetDashboardData,"GetDashboard")
    return GetDashboardData;
  } catch (error) {
    console.log('GetDashboardApi error', error);
    return error;
  }
};
//Switch Profile - petfamilylist
export const GetFamilyListApi = async data => {
  // console.log(data,"data")
  try {
    const GetFamilyList = await executePost(
      '/fleatiger/pets/petfamilydetails',
      data,
    );
    const GetFamilyListData = GetFamilyList.data ? GetFamilyList.data : [];
    // console.log(GetFamilyListData,"GetFamilyList")
    return GetFamilyListData;
  } catch (error) {
    console.log('GetFamilyListApi error', error);
    return error;
  }
};
//View Profile
export const ViewProfileApi = async data => {
  // console.log(data,"data")
  try {
    const ViewProfile = await executePost(
      '/fleatiger/pets/viewpetdetails',
      data,
    );
    const ViewProfileData = ViewProfile.data ? ViewProfile.data : [];
    // console.log(ViewProfileData,"ViewProfile")
    return ViewProfileData;
  } catch (error) {
    console.log('ViewProfileApi error', error);
    return error;
  }
};
// edit-profile to display field data
export const EditPetDetailsApi = async data => {
  // console.log(data,"data")
  try {
    const EditPetDetails = await executePost(
      '/fleatiger/pets/editpetdetails',
      data,
    );
    const EditPetDetailsData = EditPetDetails.data ? EditPetDetails.data : [];
    // console.log(EditPetDetailsData,"EditPetDetails")
    return EditPetDetailsData;
  } catch (error) {
    console.log('EditPetDetailsApi error', error);
    return error;
  }
};

// edit-profile to display field data
export const EditPetBasicDetailsApi = async data => {
  // console.log(data, "data")
  try {
    const EditPetBasicDetails = await executePost(
      '/fleatiger/pets/editpetbasicdetails',
      data,
    );
    const EditPetBasicDetailsData = EditPetBasicDetails.data
      ? EditPetBasicDetails.data
      : [];
    //
    return EditPetBasicDetailsData;
  } catch (error) {
    console.log('EditPetBasicDetailsApi error', error);
    return error;
  }
};

// edit-pesonality to display field data
export const EditViewPersonalityApi = async data => {
  // console.log(data, "data")
  try {
    const EditViewPersonality = await executePost(
      '/fleatiger/pets/editpetpersonality',
      data,
    );
    const EditViewPersonalityData = EditViewPersonality.data
      ? EditViewPersonality.data
      : [];
    //
    return EditViewPersonalityData;
  } catch (error) {
    console.log('EditViewPersonalityApi error', error);
    return error;
  }
};

// update-personality
export const UpdatePersonalityApi = async data => {
  // console.log(data, "data")
  try {
    const UpdatePersonality = await executePost(
      '/fleatiger/pets/updatepersonality',
      data,
    );
    const UpdatePersonalityData = UpdatePersonality.data
      ? UpdatePersonality.data
      : [];
    //
    return UpdatePersonalityData;
  } catch (error) {
    console.log('UpdatePersonalityApi error', error);
    return error;
  }
};

// edit-toys to display field data
export const EditViewToysApi = async data => {
  // console.log(data,"data")
  try {
    const EditViewToys = await executePost(
      '/fleatiger/pets/editpettoybox',
      data,
    );
    const EditViewToysData = EditViewToys.data ? EditViewToys.data : [];
    //
    return EditViewToysData;
  } catch (error) {
    console.log('EditViewToysApi error', error);
    return error;
  }
};

// edit-food to display field data
export const EditViewFoodApi = async data => {
  // console.log(data, "data")
  try {
    const EditViewFood = await executePost('/fleatiger/pets/editpetfood', data);
    const EditViewFoodData = EditViewFood.data ? EditViewFood.data : [];
    //
    return EditViewFoodData;
  } catch (error) {
    console.log('EditViewFoodApi error', error);
    return error;
  }
};

// edit-food to display field data
export const EditViewLikesDislikesApi = async data => {
  // console.log(data, "data")
  try {
    const EditViewLikesDislikes = await executePost(
      '/fleatiger/pets/editpetlikesdislikes',
      data,
    );
    const EditViewLikesDislikesData = EditViewLikesDislikes.data
      ? EditViewLikesDislikes.data
      : [];
    //
    return EditViewLikesDislikesData;
  } catch (error) {
    console.log('EditViewLikesDislikesApi error', error);
    return error;
  }
};

// edit-food to display field data
export const UpdateLikesDislikesApi = async data => {
  // console.log(data, "data")
  try {
    const UpdateLikesDislikes = await executePost(
      '/fleatiger/pets/updatepetlikesdislikes',
      data,
    );
    const UpdateLikesDislikesData = UpdateLikesDislikes.data
      ? UpdateLikesDislikes.data
      : [];
    //
    return UpdateLikesDislikesData;
  } catch (error) {
    console.log('UpdateLikesDislikesApi error', error);
    return error;
  }
};

// update-toys
export const UpdateToysApi = async data => {
  // console.log(data, "data")
  try {
    const UpdateToys = await executePost(
      '/fleatiger/pets/updatepettoybox',
      data,
    );
    const UpdateToysData = UpdateToys.data ? UpdateToys.data : [];
    //
    return UpdateToysData;
  } catch (error) {
    console.log('UpdateToysApi error', error);
    return error;
  }
};

// Edit - Update-weight

export const UpdateFoodApi = async data => {
  // console.log(data,"data")
  try {
    const UpdateFoodApi = await executePost(
      '/fleatiger/pets/updatepetfood',
      data,
    );
    const UpdateFoodApiData = UpdateFoodApi.data ? UpdateFoodApi.data : [];
    // console.log(UpdateFoodApiData,"UpdateFoodApi")
    return UpdateFoodApiData;
  } catch (error) {
    console.log('UpdateFoodApi error', error);
    return error;
  }
};

// Edit - Update-PetDetails

export const UpdatePetDetailsApi = async data => {
  // console.log(data,"data")
  try {
    const UpdatePetDetails = await executePost(
      '/fleatiger/pets/updatepetbasicdetails',
      data,
    );
    const UpdatePetDetailsData = UpdatePetDetails.data
      ? UpdatePetDetails.data
      : [];
    // console.log(UpdatePetDetailsData,"UpdatePetDetails")
    return UpdatePetDetailsData;
  } catch (error) {
    console.log('UpdatePetDetailsApi error', error);
    return error;
  }
};

// Edit - Update-height

export const UpdateHeightApi = async data => {
  // console.log(data,"data")
  try {
    const UpdateHeightApi = await executePost(
      '/fleatiger/pets/updatepetheightmetric',
      data,
    );
    const UpdateHeightApiData = UpdateHeightApi.data
      ? UpdateHeightApi.data
      : [];
    // console.log(UpdateHeightApiData,"UpdateHeightApi")
    return UpdateHeightApiData;
  } catch (error) {
    console.log('UpdateHeightApi error', error);
    return error;
  }
};

// Edit - Update-weight

export const UpdateWeightApi = async data => {
  // console.log(data,"data")
  try {
    const UpdateWeightApi = await executePost(
      '/fleatiger/pets/updatepetweightmetric',
      data,
    );
    const UpdateweightApiData = UpdateWeightApi.data
      ? UpdateWeightApi.data
      : [];
    // console.log(UpdateWeightApiData,"UpdateWeightApi")
    return UpdateweightApiData;
  } catch (error) {
    console.log('UpdateWeightApi error', error);
    return error;
  }
};

// //////---- display friend-list----

export const getFriendListApi = async data => {
  // console.log(data,"data")
  try {
    const getFriendListApi = await executePost(
      '/fleatiger/pets/getuserpetfriendslist',
      data,
    );
    const getFriendListApiData = getFriendListApi.data
      ? getFriendListApi.data
      : [];
    // console.log(getFriendListApiData,"getFriendListApi")
    return getFriendListApiData;
  } catch (error) {
    console.log('getFriendListApi error', error);
    return error;
  }
};

// //// add friend from list
export const GetAddPetFriendListApi = async data => {
  // console.log(data,"data")
  try {
    const GetAddPetFriendList = await executePost(
      '/fleatiger/pets/getpetaddfriendslist',
      data,
    );
    const GetAddPetFriendListData = GetAddPetFriendList.data
      ? GetAddPetFriendList.data
      : [];
    // console.log(GetAddPetFriendListData,"GetAddPetFriendList")
    return GetAddPetFriendListData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// //// send friend request
export const SendFriendRequestApi = async data => {
  // console.log(data,"data")
  try {
    const SendFriendRequest = await executePost(
      '/fleatiger/pets/addpetfriendrequest',
      data,
    );
    const SendFriendRequestData = SendFriendRequest.data
      ? SendFriendRequest.data
      : [];
    // console.log(SendFriendRequestData,"SendFriendRequest")
    return SendFriendRequestData;
  } catch (error) {
    console.log('SendFriendRequestApi error', error);
    return error;
  }
};

// //// like and dislike - hearts--friend
export const LikeDislikeApi = async data => {
  // console.log(data,"data")
  try {
    const LikeDislike = await executePost(
      '/fleatiger/pets/updatepetlikedislikestatus',
      data,
    );
    const LikeDislikeData = LikeDislike.data ? LikeDislike.data : [];
    // console.log(LikeDislikeData,"LikeDislike")
    return LikeDislikeData;
  } catch (error) {
    console.log('LikeDislikeApi error', error);
    return error;
  }
};

// friend-list - remove friend

export const RemovefriendFromListApi = async data => {
  // console.log(data,"data")
  try {
    const RemovefriendFromList = await executePost(
      '/fleatiger/pets/removeFriend',
      data,
    );
    const RemovefriendFromListData = RemovefriendFromList.data
      ? RemovefriendFromList.data
      : [];
    // console.log(RemovefriendFromListData,"RemovefriendFromList")
    return RemovefriendFromListData;
  } catch (error) {
    console.log('RemovefriendFromListApi error', error);
    return error;
  }
};

// pet-personality
export const PetPersonalitySliderApi = async data => {
  // console.log(data,"data")
  try {
    const PetPersonalitySlider = await executeGET(
      '/fleatiger/pets/pet_personalities',
      data,
    );
    const PetPersonalitySliderData = PetPersonalitySlider.data
      ? PetPersonalitySlider.data
      : [];
    // console.log( PetPersonalitySliderData," PetPersonalitySlider")
    return PetPersonalitySliderData;
  } catch (error) {
    console.log('PetPersonalitySliderApi error', error);
    return error;
  }
};

// toy-slider

export const ToySliderApi = async data => {
  // console.log(data,"data")
  try {
    const ToySlider = await executeGET(
      '/fleatiger/pets/toy_categories_with_default_value',
      data,
    );
    const ToySliderData = ToySlider.data ? ToySlider.data : [];
    // console.log( ToySliderData," PetPersonalitySlider")
    return ToySliderData;
  } catch (error) {
    console.log('ToySliderApi error', error);
    return error;
  }
};

// food-slider

export const FoodSliderApi = async data => {
  // console.log(data,"data")
  try {
    const FoodSlider = await executeGET(
      '/fleatiger/pets/food_categories_with_default_value',
      data,
    );
    const FoodSliderData = FoodSlider.data ? FoodSlider.data : [];
    // console.log( FoodSliderData," PetPersonalitySlider")
    return FoodSliderData;
  } catch (error) {
    console.log('FoodSliderApi error', error);
    return error;
  }
};

// likes/dislikes
export const LikesDisLikesSliderApi = async data => {
  // console.log(data,"data")
  try {
    const LikesDisLikesSlider = await executeGET(
      '/fleatiger/pets/pet_likes_dislikes_categories_with_default_value',
      data,
    );
    const LikesDisLikesSliderData = LikesDisLikesSlider.data
      ? LikesDisLikesSlider.data
      : [];
    return LikesDisLikesSliderData;
  } catch (error) {
    console.log('LikesDisLikesSliderApi error', error);
    return error;
  }
};

// CompareFamilyData
export const CompareFamilyApi = async data => {
  // console.log(data,"data")
  try {
    const CompareFamily = await executePost('/fleatiger/pets/compare', data);
    const CompareFamilyData = CompareFamily.data ? CompareFamily.data : [];
    return CompareFamilyData;
  } catch (error) {
    console.log('CompareFamilyApi error', error);
    return error;
  }
};

// CompareFamilyData
export const getSiblingListApi = async data => {
  // console.log(data,"data")
  try {
    const getSiblingList = await executePost(
      '/fleatiger/pets/getsiblingspetlist',
      data,
    );
    const getSiblingListData = getSiblingList.data ? getSiblingList.data : [];
    return getSiblingListData;
  } catch (error) {
    console.log('getSiblingListApi error', error);
    return error;
  }
};

// activity Type-list
export const getActivityTypeApi = async data => {
  // console.log(data,"data")
  try {
    const getActivityType = await executeGET(
      '/fleatiger/pets/get_all_activitytypes',
      data,
    );
    const getActivityTypeData = getActivityType.data
      ? getActivityType.data
      : [];
    // console.log(LikesDisLikesSliderData," PetPersonalitySlider")
    return getActivityTypeData;
  } catch (error) {
    console.log('getActivityTypeApi error', error);
    return error;
  }
};

// activity Type-list
export const SaveActivityApi = async data => {
  // console.log(data,"data")
  try {
    const SaveActivity = await executePost(
      '/fleatiger/pets/add_pet_activity_manually',
      data,
    );
    const SaveActivityData = SaveActivity.data ? SaveActivity.data : [];
    // console.log(LikesDisLikesSliderData," PetPersonalitySlider")
    return SaveActivityData;
  } catch (error) {
    console.log('SaveActivityApi error', error);
    return error;
  }
};

// activities
export const GetActivitiesApi = async data => {
  // console.log(data,"data")
  try {
    const GetActivities = await executePost(
      '/fleatiger/pets/get_activities',
      data,
    );
    const GetActivitiesData = GetActivities.data ? GetActivities.data : [];
    return GetActivitiesData;
  } catch (error) {
    console.log('GetActivitiesApi error', error);
    return error;
  }
};

// get-active-time-dashboard
export const GetActiveTimeApi = async data => {
  // console.log(data,"data")
  try {
    const GetActivitiesTime = await executePost(
      '/fleatiger/pets/petactivitytimeline',
      data,
    );
    const GetActivitiesTimeData = GetActivitiesTime.data
      ? GetActivitiesTime.data
      : [];
    return GetActivitiesTimeData;
  } catch (error) {
    console.log('GetActiveTimeApi error', error);
    return error;
  }
};

// delete - RemovePetProfileApi
export const RemovePetProfileApi = async data => {
  // console.log(data,"data")
  try {
    const RemovePet = await executePost(
      '/fleatiger/pets/deletepetfamilymember',
      data,
    );
    const RemovePetData = RemovePet.data ? RemovePet.data : [];
    return RemovePetData;
  } catch (error) {
    console.log('RemovePetProfileApi error', error);
    return error;
  }
};

// totalEnergy
export const GetTotalEnergyApi = async data => {
  // console.log(data,"data")
  try {
    const TotalEnergy = await executePost('/fleatiger/pets/totalEnergy', data);
    const TotalEnergyData = TotalEnergy.data ? TotalEnergy.data : [];
    return TotalEnergyData;
  } catch (error) {
    console.log('GetTotalEnergyApi error', error);
    return error;
  }
};

// display- friend-i-met-completed-activity
export const getFriendListActivityApi = async data => {
  // console.log(data,"data")
  try {
    const getFriendListApi = await executePost(
      '/fleatiger/pets/activity_pet_friends_list',
      data,
    );
    const getFriendListApiData = getFriendListApi.data
      ? getFriendListApi.data
      : [];
    // console.log(getFriendListApiData,"getFriendListApi")
    return getFriendListApiData;
  } catch (error) {
    console.log('getFriendListActivityApi error', error);
    return error;
  }
};

// display- completed-activity
export const getCompletedActivityApi = async data => {
  // console.log(data,"data")
  try {
    const getCompletedApi = await executePost(
      '/fleatiger/pets/petcompletedactivity',
      data,
    );
    const getCompletedApiData = getCompletedApi.data
      ? getCompletedApi.data
      : [];
    // console.log(getCompletedApiData,"getCompletedApi")
    return getCompletedApiData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// Social login
export const SocialLoginApi = async data => {
  // console.log(data,"data")
  try {
    const TotalEnergy = await executePost('/fleatiger/user/social_login', data);
    const TotalEnergyData = TotalEnergy.data ? TotalEnergy.data : [];
    return TotalEnergyData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// display- pet-add-friend list
export const getNeedToFriendListApi = async data => {
  // console.log(data,"data")
  try {
    const getAddFriendList = await executePost(
      '/fleatiger/pets/activity_addmore_friends_list',
      data,
    );
    const getAddFriendListData = getAddFriendList.data
      ? getAddFriendList.data
      : [];
    // console.log(getAddFriendListData,"getAddFriendList")
    return getAddFriendListData;
  } catch (error) {
    console.log(' getNeedToFriendListApi error', error);
    return error;
  }
};

// display- pet-add-friend list
export const DeletefriendIMetApi = async data => {
  // console.log(data,"data")
  try {
    const DeletefriendIMet = await executePost(
      '/fleatiger/pets/delete_activity_petfriend',
      data,
    );
    const DeletefriendIMetData = DeletefriendIMet.data
      ? DeletefriendIMet.data
      : [];
    // console.log(DeletefriendIMetData,"DeletefriendIMet")
    return DeletefriendIMetData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// display- activity-completed-save-img
export const UploadActivityImageApi = async data => {
  // console.log(data,"data")
  try {
    const UploadActivityImageApi = await executePost(
      '/fleatiger/pets/savecompletedactivity',
      data,
    );
    const UploadActivityImageApiData = UploadActivityImageApi.data
      ? UploadActivityImageApi.data
      : [];
    // console.log(UploadActivityImageApiData,"UploadActivityImageApi")
    return UploadActivityImageApiData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// display- activity-completed-add-friend-plus
export const AddFriendActivityApi = async data => {
  // console.log(data,"data")
  try {
    const AddFriendActivity = await executePost(
      '/fleatiger/pets/add_activity_petfriend',
      data,
    );
    const AddFriendActivityData = AddFriendActivity.data
      ? AddFriendActivity.data
      : [];
    // console.log(AddFriendActivityData,"AddFriendActivity")
    return AddFriendActivityData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// display- logbook
export const LogbookAPI = async data => {
  // console.log(data,"data")
  try {
    const Logbook = await executePost(
      '/fleatiger/pets/get_logbook_details',
      data,
    );
    const LogbookData = Logbook.data ? Logbook.data : [];
    // console.log(LogbookData,"Logbook")
    return LogbookData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// deleteaddedactivity
export const DeleteActivityAPI = async data => {
  // console.log(data,"data")
  try {
    const DeleteActivity = await executePost(
      '/fleatiger/pets/deleteaddedactivity',
      data,
    );
    const DeleteActivityData = DeleteActivity.data ? DeleteActivity.data : [];
    // console.log(DeleteActivityData,"DeleteActivity")
    return DeleteActivityData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// friendprofilepage
export const FriendProfileAPI = async data => {
  // console.log(data,"data")
  try {
    const FriendProfile = await executePost(
      '/fleatiger/pets/friendprofilepage',
      data,
    );
    const FriendProfileData = FriendProfile.data ? FriendProfile.data : [];
    // console.log(FriendProfileData,"FriendProfile")
    return FriendProfileData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// petlocationtoggle
export const LocationInfoAPI = async data => {
  // console.log(data,"data")
  try {
    const LoactionInfo = await executePost(
      '/fleatiger/pets/petlocationtoggle',
      data,
    );
    const LoactionInfoData = LoactionInfo.data ? LoactionInfo.data : [];
    // console.log(LoactionInfoData,"LoactionInfo")
    return LoactionInfoData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// viewpetlocationtoggle

export const LocationViewAPI = async data => {
  // console.log(data,"data")
  try {
    const LocationView = await executePost(
      '/fleatiger/pets/viewpetlocationtoggle',
      data,
    );
    const LocationViewData = LocationView.data ? LocationView.data : [];
    // console.log(LocationViewData,"LocationView")
    return LocationViewData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// new friend-list

export const NewFriendListAPI = async data => {
  // console.log(data,"data")
  try {
    const NewFriendList = await executePost(
      '/fleatiger/pets/petfriendrequestlist',
      data,
    );
    const NewFriendListData = NewFriendList.data ? NewFriendList.data : [];
    return NewFriendListData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const EditActivityInfoAPI = async data => {
  // console.log(data,"data")
  try {
    const EditActivityInfo = await executePost(
      '/fleatiger/pets/editcompletedactivity',
      data,
    );
    const EditActivityInfoData = EditActivityInfo.data
      ? EditActivityInfo.data
      : [];
    return EditActivityInfoData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// updatecompletedactivity
export const UpdateActivityInfoAPI = async data => {
  try {
    const UpdateActivityInfo = await executePost(
      '/fleatiger/user/updatecompletedactivity',
      data,
    );
    const UpdateActivityInfoData = UpdateActivityInfo.data
      ? UpdateActivityInfo.data
      : [];
    return UpdateActivityInfoData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// accept_friend_request
export const AcceptFriendRequestAPI = async data => {
  try {
    const AcceptFriendRequest = await executePost(
      '/fleatiger/pets/accept_friend_request',
      data,
    );
    const AcceptFriendRequestData = AcceptFriendRequest.data
      ? AcceptFriendRequest.data
      : [];
    return AcceptFriendRequestData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const DeclineFriendRequestAPI = async data => {
  try {
    const DeclineFriendRequest = await executePost(
      '/fleatiger/pets/decline_friend_request',
      data,
    );
    const DeclineFriendRequestData = DeclineFriendRequest.data
      ? DeclineFriendRequest.data
      : [];
    return DeclineFriendRequestData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// discover
export const DiscoverActivitiesAPI = async data => {
  // console.log(data,"data")
  try {
    const DiscoverActivities = await executeGET(
      '/fleatiger/pets/get_all_activitytypes',
      data,
    );
    const DiscoverActivitiesData = DiscoverActivities.data
      ? DiscoverActivities.data
      : [];
    // console.log(DiscoverActivitiesData,"DiscoverActivities")
    return DiscoverActivitiesData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// newsfeed
export const NewsfeedAPI = async data => {
  // console.log(data,"data")
  try {
    const Newsfeed = await executePost(
      '/fleatiger/pets/get_newsfeed_details',
      data,
    );
    const NewsfeedData = Newsfeed.data ? Newsfeed.data : [];
    // console.log( NewsfeedData," Newsfeed")
    return NewsfeedData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// edit-activity-friend-list-popup
export const EditactivityAddFriendListAPI = async data => {
  // console.log(data,"data")
  try {
    const editactivityAddFriendList = await executePost(
      '/fleatiger/pets/editactivityAddFriendList',
      data,
    );
    const editactivityAddFriendListData = editactivityAddFriendList.data
      ? editactivityAddFriendList.data
      : [];
    // console.log( editactivityAddFriendListData," editactivityAddFriendList")
    return editactivityAddFriendListData;
  } catch (error) {
    console.log('EditactivityAddFriendListAPI error', error);
    return error;
  }
};

// start-tracking- stop button

export const SendWaypointsAPI = async data => {
  try {
    const SendWaypoints = await executePost(
      '/fleatiger/pets/add_pet_activity_tracker',
      data,
    );
    const SendWaypointsData = SendWaypoints.data ? SendWaypoints.data : [];
    return SendWaypointsData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// maintain chats in DB
export const InsertChatApi = async data => {
  console.log('InsertChatApi data', data);
  try {
    const insterchat = await executePost(
      '/fleatiger/pets/add_chatchannel_log',
      data,
    );
    const insterchatData = insterchat.data ? insterchat.data : [];
    return insterchatData;
  } catch (error) {
    console.log('InsertChatApi error', error);
    return error;
  }
};

// get chat List from DB
export const getChatListApi = async data => {
  try {
    const getChat = await executePost(
      '/fleatiger/pets/get_channellog_friend_details',
      data,
    );
    const getChatData = getChat.data ? getChat.data : [];
    return getChatData;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

// check-user-name existORNot

export const CheckUserNameApi = async data => {
  try {
    const CheckUserName = await executePost(
      '/fleatiger/user/createupdate_petuser_name',
      data,
    );
    const CheckUserNameData = CheckUserName.data ? CheckUserName.data : [];
    return CheckUserNameData;
  } catch (error) {
    return error;
  }
};

export const FindMeApi = async data => {
  try {
    const FindMeApi = await executePost(
      '/fleatiger/pets/findmypetlocation',
      data,
    );
    const FindMeApiData = FindMeApi.data ? FindMeApi.data : [];
    return FindMeApiData;
  } catch (error) {
    console.log('findMe Api err', error);
    return error;
  }
};

export const FindMyFriendsApi = async data => {
  try {
    const FindmyFrndApi = await executePost(
      '/fleatiger/pets/getpetandpetfriendscoordinateslist',
      data,
    );
    const FindmyFrndApiData = FindmyFrndApi.data ? FindmyFrndApi.data : [];
    return FindmyFrndApiData;
  } catch (error) {
    console.log('find my friends Api err', error);
    return error;
  }
};

export const AddActivityByImeiApi = async data => {
  try {
    const AddActivityByImeiApi = await executePost(
      '/fleatiger/pets/add_pet_activity_by_imeitracker',
      data,
    );
    const AddActivityByImeiApiData = AddActivityByImeiApi.data
      ? AddActivityByImeiApi.data
      : [];
    return AddActivityByImeiApiData;
  } catch (error) {
    console.log('AddActivityByImeiApi err', error);
    return error;
  }
};

export const TrackerApi = async data => {
  try {
    const TrackerApi = await executeTracker(
      '/prod-api/iot/api/v1/param/' + data,
    );
    const TrackerApiData = TrackerApi.data ? TrackerApi.data : [];
    return TrackerApiData;
  } catch (error) {
    console.log('Tracker Api err', error);
    return error;
  }
};

export const FindmyFrndsByNameApi = async data => {
  try {
    const FindmyFrndsByNameApi = await executePost(
      '/fleatiger/pets/getpetdetailsbypetname',
      data,
    );
    const FindmyFrndsByNameApiData = FindmyFrndsByNameApi.data
      ? FindmyFrndsByNameApi.data
      : [];
    return FindmyFrndsByNameApiData;
  } catch (error) {
    console.log('FindmyFrndsByNameApi err', error);
    return error;
  }
};

export const FindmyFrndCoordinatesApi = async data => {
  try {
    const FindmyFrndCoordinatesApi = await executePost(
      '/fleatiger/pets/findpetlocationcoordinates',
      data,
    );
    const FindmyFrndCoordinatesApiData = FindmyFrndCoordinatesApi.data
      ? FindmyFrndCoordinatesApi.data
      : [];
    return FindmyFrndCoordinatesApiData;
  } catch (error) {
    console.log('FindmyFrndCoordinatesApiData err', error);
    return error;
  }
};

export const NewsLikeDisLikeApi = async data => {
  try {
    const NewsLikeDisLikeApi = await executePost(
      '/fleatiger/pets/newsfeed_likes',
      data,
    );
    const NewsLikeDisLikeApiData = NewsLikeDisLikeApi.data
      ? NewsLikeDisLikeApi.data
      : [];
    return NewsLikeDisLikeApiData;
  } catch (error) {
    console.log('NewsLikeDisLikeApi err', error);
    return error;
  }
};

export const DeletePetChatLogApi = async data => {
  try {
    const DeletePetChatLogApi = await executePost(
      '/fleatiger/pets/delete_chatchannel_log',
      data,
    );
    const DeletePetChatLogApiData = DeletePetChatLogApi.data
      ? DeletePetChatLogApi.data
      : [];
    return DeletePetChatLogApiData;
  } catch (error) {
    console.log('DeletePetChatLogApiData err', error);
    return error;
  }
};

export const NotificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(remoteMessage.data.type);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
};

export const storeFCMTokenApi = async data => {
  try {
    const storeFCMTokenApi = await executePost('/fleatiger/savefcmtoken', data);
    const storeFCMTokenApiData = storeFCMTokenApi.data
      ? storeFCMTokenApi.data
      : [];
    return storeFCMTokenApiData;
  } catch (error) {
    console.log('storeFCMTokenApiData err', error);
    return error;
  }
};

//Subscription - Get Plans
export const GetPlanListApi = async () => {
  try {
    const GetPlanList = await executeGET('/fleatiger/subscription_plans');
    const GetPlanListData = GetPlanList.data ? GetPlanList.data : [];
    // console.log("Data", JSON.stringify(GetPlanListData));
    return GetPlanListData;
  } catch (error) {
    console.log('GetPlansApi error', error);
    return error;
  }
};

//Subscription - Subscribe Plan
export const SubscribePlanApi = async data => {
  try {
    const subscribePlan = await executePost(
      '/fleatiger/user/purchasesubscribe',
      data,
    );
    // const subscribePlan = await executePost("/fleatiger/user/subscribe", data);
    // console.log("SubscribePlanApi Response ", JSON.stringify(subscribePlan));
    return subscribePlan.data ? subscribePlan.data : 'Error';
  } catch (error) {
    console.log('SubscribePlanApi error', error);
    return error;
  }
};

//chat notification read status
export const NotificationReadApi = async data => {
  try {
    const chatReadCount = await executePost(
      '/fleatiger/readfirebasenotify',
      data,
    );
    // console.log("SubscribePlanApi Response ", JSON.stringify(subscribePlan));
    return chatReadCount.data ? chatReadCount.data : 'Error';
  } catch (error) {
    console.log('chatNotificationReadApi error', error);
    return error;
  }
};

//chat notification read status
export const userSubscriptionInfoApi = async data => {
  try {
    const userSubscriptionInfo = await executePost(
      '/fleatiger/get_user_subscription_info',
      data,
    );
    // console.log("SubscribePlanApi Response ", JSON.stringify(subscribePlan));
    return userSubscriptionInfo.data ? userSubscriptionInfo.data : 'Error';
  } catch (error) {
    console.log('userSubscriptionInfoApi error', error);
    return error;
  }
};

//check duplicate IMEI number
export const checkImeiExixtsApi = async data => {
  try {
    const checkImeiExixtsApiInfo = await executePost(
      '/fleatiger/pets/checkimeipresence',
      data,
    );
    // console.log("SubscribePlanApi Response ", JSON.stringify(subscribePlan));
    return checkImeiExixtsApiInfo.data ? checkImeiExixtsApiInfo.data : 'Error';
  } catch (error) {
    console.log('checkImeiExixtsApi error', error);
    return error;
  }
};

//check duplicate IMEI number
export const EditcheckImeiExixtsApi = async data => {
  try {
    const EditcheckImeiExixtsApiData = await executePost(
      '/fleatiger/pets/editdetailscheckimeipresence',
      data,
    );
    // console.log("SubscribePlanApi Response ", JSON.stringify(subscribePlan));
    return EditcheckImeiExixtsApiData.data
      ? EditcheckImeiExixtsApiData.data
      : 'Error';
  } catch (error) {
    console.log('EditcheckImeiExixtsApi error', error);
    return error;
  }
};

export const chatHighlightApi = async data => {
  try {
    const FindmyFrndApi = await executePost(
      '/fleatiger/countfirebasenotify',
      data,
    );
    const FindmyFrndApiData = FindmyFrndApi.data ? FindmyFrndApi.data : [];
    return FindmyFrndApiData;
  } catch (error) {
    console.log('find my friends Api err', error);
    return error;
  }
};

//Get user subscription detail
export const UserCurrentSubscriptionApi = async data => {
  try {
    const userSubscribePlan = await executePost(
      '/fleatiger/get_user_subscription_info',
      data,
    );
    return userSubscribePlan.data
      ? userSubscribePlan.data.data
        ? userSubscribePlan.data.data.subscription_info
          ? userSubscribePlan.data.data.subscription_info
          : ''
        : ''
      : '';
  } catch (error) {
    console.log('UserCurrentSubscriptionApi error', error);
    return error;
  }
};

//delete user Account
export const DeleteUserAccApi = async data => {
  try {
    const DeleteUserAcc = await executePost(
      '/fleatiger/pets/delete-account-details',
      data,
    );
    return DeleteUserAcc.data ? DeleteUserAcc.data : '';
  } catch (error) {
    console.log('DeleteUserAccApi error', error);
    return error;
  }
};

// Activity description  page Api
export const ActivityDescriptionApi = async data => {
  try {
    const ActivityDes = await executePost(
      '/fleatiger/pets/newsFeedActivityCommentViewDetails',
      data,
    );
    return ActivityDes.data ? ActivityDes.data : '';
  } catch (error) {
    console.log('ActivityDescriptionApi   error', error);
    return error;
  }
};

// get settings  page Api
export const getSettingsApi = async data => {
  try {
    const getSettings = await executePost(
      '/fleatiger/user/UserSettingsPage',
      data,
    );
    return getSettings.data ? getSettings.data : '';
  } catch (error) {
    console.log('getSettingsApi error', error);
    return error;
  }
};

// get settings  page Api
export const updateBasicSettingsApi = async data => {
  try {
    const updateBasicSettings = await executePost(
      '/fleatiger/user/UpdateUserSettingsPage',
      data,
    );
    return updateBasicSettings.data ? updateBasicSettings.data : '';
  } catch (error) {
    console.log('getSettingsApi error', error);
    return error;
  }
};

// Add comment in description page Api
export const AddNewsFeedCommentApi = async data => {
  try {
    const AddComment = await executePost(
      '/fleatiger/pets/newsFeedActivityAddComment',
      data,
    );
    return AddComment.data ? AddComment.data : '';
  } catch (error) {
    console.log('AddCommentApi error', error);
    return error;
  }
};

// list of liked profile  Api
export const NewsFeedAllLikesApi = async data => {
  try {
    const likedList = await executePost(
      '/fleatiger/pets/newsFeedActivityAllLikesDetails',
      data,
    );
    return likedList.data ? likedList.data : '';
  } catch (error) {
    console.log('NewsFeedAllLikesApi error', error);
    return error;
  }
};

// list of Comments Api
export const CommentsListApi = async data => {
  try {
    const commentList = await executePost(
      '/fleatiger/pets/newsFeedActivityAllCommentDetails',
      data,
    );
    return commentList.data ? commentList.data : '';
  } catch (error) {
    console.log('CommentsListApi error', error);
    return error;
  }
};

// get tracker status Api
export const TrackerStatusApi = async data => {
  try {
    const trackerStatus = await executePost(
      '/fleatiger/pets/petTrackerStatusDetails',
      data,
    );
    return trackerStatus.data ? trackerStatus.data : '';
  } catch (error) {
    console.log('TrackerStatusApi error', error);
    return error;
  }
};

// get notification list Api
export const NotificationListApi = async data => {
  try {
    const notificationList = await executePost(
      '/fleatiger/pets/notificationPageViewDetails',
      data,
    );
    return notificationList.data ? notificationList.data : '';
  } catch (error) {
    console.log('NotificationListApi error', error);
    return error;
  }
};
// get notification badge count Api
export const NotificationBadgeCountApi = async data => {
  try {
    const notificationCount = await executePost(
      '/fleatiger/pets/unread-notification-chat-count',
      data,
    );
    return notificationCount.data ? notificationCount.data : '';
  } catch (error) {
    console.log('NotificationBadgeCountApi error', error);
    return error;
  }
};

// get notification badge count Api
export const UpdateNotificationReadCountUpdateApi = async data => {
  try {
    const notificationCountUpdate = await executePost(
      '/fleatiger/pets/notificationPageUpdateReadStatus',
      data,
    );
    return notificationCountUpdate.data ? notificationCountUpdate.data : '';
  } catch (error) {
    console.log('NotificationBadgeCountUpdateApi error', error);
    return error;
  }
};

// new API tracker
export const TrackerHandlerApi = async data => {
  try {
    const TrackerApi = await executePost(
      '/fleatiger/pets/new_add_pet_activity_by_imeitracker',
      data,
    );
    const TrackerApiData = TrackerApi.data ? TrackerApi.data : [];
    return TrackerApiData;
  } catch (error) {
    console.log('TrackerHandlerApi err', error);
    return error;
  }
};

export const SaveActivityByImeiApi = async data => {
  try {
    const SaveActivityByImeiApi = await executePost(
      '/fleatiger/pets/save_pet_activity_by_imeitracker',
      data,
    );
    const SaveActivityByImeiApiData = SaveActivityByImeiApi.data
      ? SaveActivityByImeiApi.data
      : [];
    return SaveActivityByImeiApiData;
  } catch (error) {
    console.log('SaveActivityByImeiApi err', error);
    return error;
  }
};


export const CreateGroupApi = async data => {
  try {
    const CreateGroupApi = await executePost(
      '/fleatiger/pets/create_group',
      data,
    );
    const CreateGroupApiData = CreateGroupApi.data
      ? CreateGroupApi.data
      : [];
    return CreateGroupApiData;
  } catch (error) {
    console.log('CreateGroupApi err', error);
    return error;
  }
};

export const UpdateGroupApi = async data => {
  try {
    const UpdateGroupApi = await executePost(
      '/fleatiger/pets/edit_group',
      data,
    );
    const UpdateGroupApiData = UpdateGroupApi.data
      ? UpdateGroupApi.data
      : [];
    return UpdateGroupApiData;
  } catch (error) {
    console.log('UpdateGroupApi err', error);
    return error;
  }
};

export const AllGroupsListApi = async (data) => {
  try {
    const AllGroupsListApi = await executePost(
      '/fleatiger/pets/list_all_groups', data
    );
    const AllGroupsListApiData = AllGroupsListApi.data
      ? AllGroupsListApi.data
      : [];
    return AllGroupsListApiData;
  } catch (error) {
    console.log('AllGroupsListApi err', error);
    return error;
    // if (error.response) {
    //   console.log("Error Data:", error.response.data);
    //   console.log("Error Status:", error.response.status);
    //   console.log("Error Headers:", error.response.headers);
    // } else {
    //   console.log("Error Message:", error.message);
    // }
  }
};


export const CreateEventApi = async (data) => {
  try {
    const CreateEventApi = await executePost(
      '/fleatiger/pets/create_event', data
    );
    const CreateEventApiData = CreateEventApi.data
      ? CreateEventApi.data
      : [];
    return CreateEventApiData;
  } catch (error) {
    console.log('CreateEventApi err', error);
    return error;
  }
};


export const ExitGroupApi = async (data) => {
  try {
    const ExitGroupApi = await executePost(
      '/fleatiger/pets/exit_group', data
    );
    const ExitGroupApiData = ExitGroupApi.data
      ? ExitGroupApi.data
      : [];
    return ExitGroupApiData;
  } catch (error) {
    console.log('ExitGroupApi err', error);
    return error;
  }
};


export const DeleteGroupApi = async (data) => {
  try {
    const DeleteGroupApi = await executePost(
      '/fleatiger/pets/delete_group', data
    );
    const DeleteGroupApiData = DeleteGroupApi.data
      ? DeleteGroupApi.data
      : [];
    return DeleteGroupApiData;
  } catch (error) {
    console.log('DeleteGroupApi err', error);
    return error;
  }
};


export const GroupInfoApi = async (data) => {
  try {
    const GroupInfoApi = await executePost(
      '/fleatiger/pets/group_details', data
    );
    const GroupInfoApiData = GroupInfoApi.data
      ? GroupInfoApi.data
      : [];
    return GroupInfoApiData;
  } catch (error) {
    console.log('GroupInfoApi err', error);
    return error;
    // if (error.response) {
    //   console.log("Error Data:", error.response.data);
    //   console.log("Error Status:", error.response.status);
    //   console.log("Error Headers:", error.response.headers);
    // } else {
    //   console.log("Error Message:", error.message);
    // }
  }
};


export const RequestToJoinApi = async (data) => {
  try {
    const RequestToJoinApi = await executePost(
      '/fleatiger/pets/join_group', data
    );
    const RequestToJoinApiData = RequestToJoinApi.data
      ? RequestToJoinApi.data
      : [];
    return RequestToJoinApiData;
  } catch (error) {
    console.log('RequestToJoinApi err', error);
    return error;
  }
};


export const UpdateRequestStatusApi = async (data) => {
  try {
    const UpdateRequestStatusApi = await executePost(
      '/fleatiger/pets/manage_join_request', data
    );
    const UpdateRequestStatusApiData = UpdateRequestStatusApi.data
      ? UpdateRequestStatusApi.data
      : [];
    return UpdateRequestStatusApiData;
  } catch (error) {
    console.log('UpdateRequestStatusApi err', error);
    return error;
  }
};


export const AddGroupChatApi = async (data) => {
  try {
    const AddGroupChatApi = await executePost(
      '/fleatiger/pets/add_groupchatchannel_log', data
    );
    const AddGroupChatApiData = AddGroupChatApi.data
      ? AddGroupChatApi.data
      : [];
    return AddGroupChatApiData;
  } catch (error) {
    console.log('AddGroupChatApi err', error);
    return error;
  }
};



export const AvailableGroupMembersApi = async (data) => {
  try {
    const AvailableGroupMembersApi = await executePost(
      '/fleatiger/pets/get_available_friends_for_group', data
    );
    const AvailableGroupMembersApiData = AvailableGroupMembersApi.data
      ? AvailableGroupMembersApi.data
      : [];
    return AvailableGroupMembersApiData;
  } catch (error) {
    console.log('AvailableGroupMembersApi err', error);
    return error;
  }
};


// get group chat List from DB
export const getgroupChatListApi = async data => {
  try {
    const getgroupChatListApi = await executePost(
      '/fleatiger/pets/get_group_channellog_friend_details',
      data,
    );
    const getgroupChatListApiData = getgroupChatListApi.data ? getgroupChatListApi.data : [];
    return getgroupChatListApiData;
  } catch (error) {
    console.log('getgroupChatListApi error', error);
    return error;
  }
};


// manage group Admin DB
export const ManageGroupAdminRoleApi = async data => {
  try {
    const ManageGroupAdminRoleApi = await executePost(
      '/fleatiger/pets/manage_admin_permission',
      data,
    );
    const ManageGroupAdminRoleApiData = ManageGroupAdminRoleApi.data ? ManageGroupAdminRoleApi.data : [];
    return ManageGroupAdminRoleApiData;
  } catch (error) {
    console.log('ManageGroupAdminRoleApi error', error);
    return error;
  }
};


// manage group Admin DB
export const EventInfoApi = async data => {
  try {
    const EventInfoApi = await executePost(
      '/fleatiger/pets/view_edit_event',
      data,
    );
    const EventInfoApiData = EventInfoApi.data ? EventInfoApi.data : [];
    return EventInfoApiData;
  } catch (error) {
    console.log('EventInfoApi error', error);
    return error;
  }
};

export const EventJoinRequestApi = async data => {
  try {
    const EventJoinRequestApi = await executePost(
      '/fleatiger/pets/join_event',
      data,
    );
    const EventJoinRequestApiData = EventJoinRequestApi.data ? EventJoinRequestApi.data : [];
    return EventJoinRequestApiData;
  } catch (error) {
    console.log('EventJoinRequestApi error', error);
    return error;
  }
};

// mail confiramtion on delete Account
export const DeleteAccountConfirmationApi = async data => {
  try {
    const DeleteAccountConfirmationApi = await executePost(
      '/fleatiger/pets/initiate-delete',
      data,
    );
    const DeleteAccountConfirmationApiData = DeleteAccountConfirmationApi.data ? DeleteAccountConfirmationApi.data : [];
    return DeleteAccountConfirmationApiData;
  } catch (error) {
    console.log('DeleteAccountConfirmationApi error', error);
    return error;
  }
};

// verify otp on delete Account
export const DeleteAccountVerifyApi = async data => {
  try {
    const DeleteAccountVerifyApi = await executePost(
      '/fleatiger/pets/verify-delete-otp',
      data,
    );
    const DeleteAccountVerifyApiData = DeleteAccountVerifyApi.data ? DeleteAccountVerifyApi.data : [];
    return DeleteAccountVerifyApiData;
  } catch (error) {
    console.log('DeleteAccountVerifyApi error', error);
    return error;
  }
};



// get groups list
export const getgroupsListApi = async data => {
  try {
    const getgroupsListApi = await executePost(
      '/fleatiger/groups/get-groups',
      data,
    );
    const getgroupsListApiData = getgroupsListApi.data ? getgroupsListApi.data : [];
    return getgroupsListApiData;
  } catch (error) {
    console.log('getgroupsListApi error', error);
    return error;
  }
};


// get groups list
export const getNewgroupsListApi = async data => {
  try {
    const getNewgroupsListApi = await executePost(
      '/fleatiger/groups/member-groups-without-chats',
      data,
    );
    const getNewgroupsListApiData = getNewgroupsListApi.data ? getNewgroupsListApi.data : [];
    return getNewgroupsListApiData;
  } catch (error) {
    console.log('getNewgroupsListApi error', error);
    return error;
  }
};