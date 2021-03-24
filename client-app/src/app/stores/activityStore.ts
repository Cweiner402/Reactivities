import { makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity  | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor(){
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;

            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities = await agent.Activities.list();
            //use run in action for async 
            
                activities.forEach(activity => {
                    this.setActivty(activity);
                    //activity.date = activity.date.split('T')[0];
                    //this.activityRegistry.set(activity.id, activity);
                    //this.activities.push(activity);
                  })
                  this.setLoadingInitial(false);
            
            

        }catch (error){
            console.log(error);
            this.setLoadingInitial (false);
            
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity){
            this.selectedActivity = activity;
            return activity;
        }else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivty(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)  
                
            }
        }

    }

    private setActivty = (activity: Activity) =>{
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }
    
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    //used for displaying on one page
    // selectActivity = (id:string) => {
    //     this.selectedActivity = this.activityRegistry.get(id);
    //    // this.selectedActivity = this.activities.find(a => a.id === id);
    // }

    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        }catch (error){
            console.log(error);
            runInAction(()=> {
                this.loading = false;
            })
        }

    }

    updateActivity = async (activity: Activity)=>{
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);       
                //this.activities =[...this.activities.filter(a => a.id !== activity.id), activity];               
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        }catch (error){
            console.log(error);
            runInAction(()=> {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                //this.activities = [...this.activities.filter(a => a.id !== id)];     
                //if (this.selectedActivity?.id === id) this.cancelSelectedActivity();          
                this.loading = false;
            })

        }catch (error){
            console.log(error);
            runInAction(()=> {
                this.loading = false;
            })
        }

    }

}