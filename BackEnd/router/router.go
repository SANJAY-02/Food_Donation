package router

import (
	"github.com/gorilla/mux"
	"github.com/sanjay/food-donate/controller"
)

func Router() *mux.Router {
	router := mux.NewRouter()
	//donor
	router.HandleFunc("/api/donate", controller.AddDonor).Methods("POST")
	router.HandleFunc("/api/donors", controller.GetAllDonors).Methods("GET")
	router.HandleFunc("/api/donate_yes", controller.FoodDonated).Methods("POST")
	router.HandleFunc("/api/donate_no", controller.FoodNotDonated).Methods("POST")
	router.HandleFunc("/api/deldonor", controller.DeleteDonor).Methods("POST")
	router.HandleFunc("/api/deletealldonors", controller.DeleteAllDonors).Methods("DELETE")
	router.HandleFunc("/api/foodstatus", controller.FoodAvailStatus).Methods("GET")
	router.HandleFunc("/api/updonor", controller.UpdateDonor).Methods("POST")

	//receiver
	router.HandleFunc("/api/receive", controller.AddReceiver).Methods("POST")
	router.HandleFunc("/api/receivers", controller.GetAllReceivers).Methods("GET")
	router.HandleFunc("/api/receive_yes", controller.FoodReceived).Methods("POST")
	router.HandleFunc("/api/receive_no", controller.FoodNotReceived).Methods("POST")
	router.HandleFunc("/api/delreceiver", controller.DeleteReceiver).Methods("POST")
	router.HandleFunc("/api/deleteallreceivers", controller.DeleteAllReceivers).Methods("DELETE")
	router.HandleFunc("/api/upreceiver", controller.UpdateReceiver).Methods("POST")

	//volunteeer
	router.HandleFunc("/api/help", controller.AddVolunteer).Methods("POST")
	router.HandleFunc("/api/volunteers", controller.GetAllVolunteers).Methods("GET")
	router.HandleFunc("/api/avail/yes", controller.VolunteerAvailable).Methods("POST")
	router.HandleFunc("/api/avail/no", controller.VolunteerNotAvailable).Methods("POST")
	router.HandleFunc("/api/volstatus", controller.VolunteerAvailStatus).Methods("GET")
	router.HandleFunc("/api/delvolunteer", controller.DeleteVolunteer).Methods("POST")
	router.HandleFunc("/api/deleteallvolunteers", controller.DeleteAllVolunteers).Methods("DELETE")
	router.HandleFunc("/api/upvolunteer", controller.UpdateVolunteer).Methods("POST")

	//user
	router.HandleFunc("/api/user/login", controller.UserLogin).Methods("POST")
	router.HandleFunc("/api/user/signup", controller.UserSignup).Methods("POST")
	router.HandleFunc("/api/user/getdetails", controller.GetUserDetails).Methods("POST")
	return router
}
