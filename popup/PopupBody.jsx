import {useState, useEffect} from 'react'
import {saveData, loadData} from './handle_storage.js'
function ExtraInfoSection() {
	const [show_friend_userid, set_show_friend_userid] = useState(false) 
	const show_friend_userid_id = "show-friend-userid"
	const show_friend_userid_text = "Show User IDs" // New variable

	const [show_account_created_date, set_show_account_created_date] = useState(false)
	const show_account_created_date_id = "show-account-created-date"
	const show_account_created_date_text = "Show Account Created Date" // New variable

	const show_account_create_date_keyname = "better-carousel-show-create-date"
	const show_account_created_date_keyname = show_account_create_date_keyname
	const show_friend_userid_keyname = "better-carousel-show-friend-userid"

	const [loaded, set_loaded] = useState(false)
	useEffect( () => {
		const get_data = async () => {
			let showaccount_val = await loadData(show_account_create_date_keyname)
			let showfrienduserid_val = await loadData(show_friend_userid_keyname)
			console.log("Extracted values: ")
			console.log("Show account")
			console.log(showaccount_val)
			console.log("Show friend userid")
			console.log(showfrienduserid_val)
			if(showaccount_val === null) {
				await saveData(show_account_create_date_keyname, false)
				showaccount_val = await loadData(show_account_create_date_keyname)
			}
			if(showfrienduserid_val === null) {
				await saveData(show_friend_userid_keyname, false)
				showfrienduserid_val = await loadData(show_friend_userid_keyname)
			}
			set_show_friend_userid(showfrienduserid_val)
			set_show_account_created_date(showaccount_val)
			set_loaded(true)
		}
		get_data()
	}, [])
	const [saving_show_friend_userid, set_saving_show_friend_userid] = useState(false)
	const [saving_show_account_created_date, set_saving_show_account_created_date] = useState(false)
	const handle_click = (e) => {
		if(e.target.closest(`#${show_friend_userid_id}`)) {
			if(!saving_show_friend_userid) {
				set_saving_show_friend_userid(true)
				saveData(show_friend_userid_keyname, 
					!show_friend_userid)
					.then( () => {set_saving_show_friend_userid(false)})
				set_show_friend_userid(!show_friend_userid)
			}
		}
		else if(e.target.closest(`#${show_account_created_date_id}`)) {
			if(!saving_show_account_created_date) {    
				set_saving_show_account_created_date(true);
				saveData(show_account_created_date_keyname, 
					!show_account_created_date)
					.then(() => { 
						set_saving_show_account_created_date(false)
					});
				set_show_account_created_date(!show_account_created_date)
			}
		}
	}
	let show_friend_userid_classname = "pressable-option"
	if (show_friend_userid) {
		show_friend_userid_classname = "selected-pressable-option"
	}

	let show_account_created_date_classname = "pressable-option"
	if (show_account_created_date) {
		show_account_created_date_classname = "selected-pressable-option"
	}
	if(!loaded) {
		return (null)
	}
	return (
		<div className="popup-section" onClick={handle_click}>
			<div className="popup-section-header">
				<h3>
					Extra Info
				</h3>
			</div>

			<div className="popup-section-body">
				<div className={show_friend_userid_classname} id={show_friend_userid_id}>
					{show_friend_userid_text}
				</div>
				<div className={show_account_created_date_classname} id={show_account_created_date_id}>
					{show_account_created_date_text}
				</div>
			</div>
		</div>
	)
}

function PopupSubsectionWithInput({title, on_add, on_delete}) {
	const pretext = "Enter a Roblox User's id"
	return (
		<div className="popup-subsection">
			<div className="popup-subsection-header">
				<h4>
					{title}	
				</h4>
			</div>
			<InputBoxAddableField pretext={pretext} on_add={on_add} on_delete={on_delete}/>
		</div>
	)
}

function UserListEntry({id}) {
	const wrapper_classname = "displayed-id-wrapper"
	return (
		<div className={wrapper_classname}>
			{id}
		</div>
	)
}

function UserList({title, list}) {
	return (
		<div className="popup-subsection">
			<div className="popup-subsection-header">
				<h4>{title}</h4>
			</div>
			{list.map((x) => <UserListEntry key={x} id={x}/>)}
		</div>	
	)
}

const whitelist_name = "Whitelist"
const blacklist_name = "Blacklist"
const additional_users_name = "Additional"
const none_name = "None"

function UserManagementSection() {
	const whitelisted_users_keyname = "Roblox-Carousel-Extension-Whitelisted-Users"
	const blacklisted_users_keyname = "Roblox-Carousel-Extension-Blacklisted-Users"
	const additional_users_keyname = "Roblox-Carousel-Extension-Additional-Users"
	const [blacklisted_users, set_blacklisted_users] = useState([])
	const [whitelisted_users, set_whitelisted_users] = useState([])
	const [additional_users, set_additional_users] = useState([])
	// entry: [userid1,userid2,...] 
	useEffect(() => {
		const fetchData = async () => {
			let whitelist_val = await loadData(whitelisted_users_keyname)
			let blacklist_val = await loadData(blacklisted_users_keyname)
			let additional_val = await loadData(additional_users_keyname)
			console.log("Extracted User Lists:")
			console.log("Whitelist:", whitelist_val)
			console.log("Blacklist:", blacklist_val)
			console.log("Additional:", additional_val)
			if (whitelist_val === null) {
				await saveData(whitelisted_users_keyname, [])
				whitelist_val = await loadData(whitelisted_users_keyname)
			}
			if (blacklist_val === null) {
				await saveData(blacklisted_users_keyname, [])
				blacklist_val = await loadData(blacklisted_users_keyname)
			}
			if (additional_val === null) {
				await saveData(additional_users_keyname, [])
				additional_val = await loadData(additional_users_keyname)
			}
			set_whitelisted_users(whitelist_val)
			set_blacklisted_users(blacklist_val)
			set_additional_users(additional_val)
		}
		fetchData()
	}, [])
	const [none_selected, set_none_selected] = useState(true)
	const [whitelist_selected, set_whitelist_selected] = useState(false)
	const [blacklist_selected, set_blacklist_selected] = useState(false)
	const display_scheme_subsection_name = "Display Scheme"
	let none_button_classname = "pressable-option"
	let whitelist_button_classname = "pressable-option" 
	let blacklist_button_classname = "pressable-option" 
	if (none_selected) {
		none_button_classname = "selected-pressable-option"
	}
	if (whitelist_selected) {
		whitelist_button_classname = "selected-pressable-option"
	}
	if (blacklist_selected) {
		blacklist_button_classname = "selected-pressable-option"
	}
	const on_displayscheme_click = (e) => {
		if(e.target.closest(`#${none_name}`)) {
			set_none_selected(true)
			set_whitelist_selected(false)
			set_blacklist_selected(false)
		}
		else if (e.target.closest(`#${whitelist_name}`)) {
			set_none_selected(false)
			set_whitelist_selected(true)
			set_blacklist_selected(false)
		}
 		else if(e.target.closest(`#${blacklist_name}`)) {
			set_none_selected(false)
			set_whitelist_selected(false)
			set_blacklist_selected(true)
		}
	}
	const [adding_to_whitelist, set_adding_to_whitelist] = useState(false)
	const whitelisted_users_section_title = "Whitelisted Users"
	const [removing_from_whitelist, set_removing_from_whitelist] = useState(false)
	const [adding_to_blacklist, set_adding_to_blacklist] = useState(false)
	const blacklisted_users_section_title = "Blacklisted Users"
	const [removing_from_blacklist, set_removing_from_blacklist] = useState(false)
	const additional_users_section_title = "Additional Users"
	const add_to_list = (list, set_list, adding_state, set_adding_state, keyname, id) => {
		if(adding_state) {
			throw new Error("Processing a previous add operation")
		}
		if(list.includes(id)) {
			throw new Error("List contains id ", id)
		}
		set_adding_state(true)
		const new_list = [...list, id]
		saveData(keyname, new_list).then(() => {
			set_adding_state(false)
			set_list(new_list)
		}, 
		(error) => {
			console.error("Failed add: ", error.message)
		})
		set_adding_state(false)
	}
	const whitelist_add = (id) => {
		try {
			add_to_list(whitelisted_users, set_whitelisted_users, adding_to_whitelist, set_adding_to_whitelist, whitelisted_users_keyname, id)
		}
		catch (e) {
			console.error("Error adding to whitelist: ", e.message)
		}

	}
	/*
	const whitelist_add = (id) => {
		if(adding_to_whitelist) {
			console.log("Could not add: currently adding to whitelist")
			return
		}
		if (whitelisted_users.includes(id)) {
			console.log("Could not add: user ", id, " in whitelist")
			return
		}
		set_adding_to_whitelist(true)
		const whitelisted_users_new = [...whitelisted_users, id]
		console.log("Adding user to whitelist ", id)
		saveData(whitelisted_users_keyname, whitelisted_users_new).then(() => {
			set_adding_to_whitelist(false)
			set_whitelisted_users(whitelisted_users_new)
		}, 
		(error) => {
			console.error("Could not save data for whitelist add operation: ", error.message)
		})
	}
	*/
	const remove_from_list = (list, set_list, remove_state, set_remove_state, keyname, id) => {
		if(remove_state) {
			throw new Error("Processing previous remove operation")
		}
		if(!list.includes(id)) {
			throw new Error(`${id} not in list`)
		}
		set_remove_state(true)
		const new_list = list.filter((x)=>x!=id)
		saveData(keyname, new_list).then(() => {
			set_remove_state(false)
			set_list(new_list)
		},
		(error) => {console.error("Failed to remove from list", error.message)}
		)
	}
	const whitelist_delete = (id) => {
		remove_from_list(whitelisted_users, set_whitelisted_users, removing_from_whitelist, set_removing_from_whitelist, whitelisted_users_keyname, id) 
	}

	/*
	const whitelist_delete = (id) => {
		if(removing_from_whitelist) {
			console.log("Could not remove: currently removing from whitelist")
			return
		}
		if (!whitelisted_users.includes(id)) {
			console.log("Could not remove: id", id, " is not in whitelist")
			return
		}
		set_removing_from_whitelist(true)
		const whitelisted_users_new = whitelisted_users.filter((x) => x != id)
		saveData(whitelisted_users_keyname, whitelisted_users_new).then(() => {
			set_removing_from_whitelist(false)
			set_whitelisted_users(whitelisted_users_new)
		},
		(error) => {
			console.error("Could not save data for whitelist delete operation: ", error.message)
		})
	}
	*/
	const on_additionalusers_add = (id) => {
		console.log("Adding user to additional users", id)
	}
	const on_additionalusers_delete = (id) => {
		console.log("Deleting user from additional users", id)
		if(!additional_users.includes(id)) {
			console.log("Did not delete additional user ", id, ": Not an additional user")
			return
		}
	}
	const blacklist_add = (id) => {
		console.log("Adding user to blacklist ", id)
	}
	const blacklist_delete = (id) => {
		console.log("Removing user from blacklist ", id)
		if(!blacklisted_users.includes(id)) {
			console.log("Did not delete blacklisted user ", id, ": Not an blacklisted user")
			return
		}
	}
	return (
		<div className="popup-section">
			<div className="popup-section-header">
				<h3>
					Manage Displayed Users
				</h3>
			</div>
			<div className="popup-section-body">
				<div className="popup-subsection" onClick={on_displayscheme_click}>
					<div className="popup-subsection-header" >
						<h4>
							{display_scheme_subsection_name}
						</h4>
					</div>
					<div className={none_button_classname} id={none_name}>
						{none_name}
					</div>
					<div className={whitelist_button_classname} id={whitelist_name}>
						{whitelist_name}
					</div>
					<div className={blacklist_button_classname} id={blacklist_name}>
						{blacklist_name}
					</div>
				</div>
				{whitelist_selected && 
					<PopupSubsectionWithInput 
						title={whitelist_name}
						on_add={whitelist_add}
						on_delete={whitelist_delete}
					/>
				}
				{blacklist_selected && 
					<PopupSubsectionWithInput 
						title={blacklist_name}
						on_add={blacklist_add}
						on_delete={blacklist_delete}
					/>
				}
				{whitelist_selected && 
					<UserList
						title={whitelisted_users_section_title}
						list={whitelisted_users}
					/>
				}
				{blacklist_selected && 
					<UserList
						title={blacklisted_users_section_title}
						list={blacklisted_users}
					/>
				}
				<PopupSubsectionWithInput 
					title={additional_users_name} 
					on_add={on_additionalusers_add} 
					on_delete={on_additionalusers_delete}
				/>

				<UserList
					title={additional_users_section_title}
					list={additional_users}
				/>
			</div>
		</div>

	)
}

function InputBoxAddableField ({pretext, on_add, on_delete}) {
	const parent_classname = "input-box-addable-wrapper" 

	const handle_click = (e) => {
		console.log("handling click ")
		if(e.target.tagName === "INPUT") {
			return
		}
		if(e.target.className === parent_classname) {
			return
		}
		const parent_element = e.target.closest(`.${parent_classname}`)
		const input_element = parent_element.querySelector('input') 
		const raw_value = input_element.value;
		const sanitized_value = raw_value.replace(/\D/g, '');
		if(raw_value !== sanitized_value) {
			console.error(`raw value ${raw_value} !== sanitized value ${sanitized_value}`)
			return
		}
		if(raw_value === "") {
			console.log("Must not be a empty string")
			return
		}
		console.log(raw_value);
		if(e.target.id === "add") {
			on_add(raw_value)
		}
		else if (e.target.id === "delete") {
			on_delete(raw_value)
		}
	}
	const [input_value, set_input_value] = useState("")
	const on_input_change = (e) => {
		const val = e.target.value;
		if (/^\d*$/.test(val)) {
			set_input_value(val); 
		}
	};
	return (
		<div className={parent_classname} onClick={handle_click}>
			<div className={`${parent_classname}-input`}>
				<input type="text" id="input" placeholder={pretext} onChange={on_input_change} value={input_value}/>
			</div>
			<div className={`${parent_classname}-buttons`}>
				<div className="pressable-option" id="add">
					Add	
				</div>
				<div className="pressable-option" id="delete">
					Remove
				</div>
			</div>
		</div>
	)
}

function PopupBody() {
	return (
		<div className="popup-body-container">
		<ExtraInfoSection/>
		<UserManagementSection/>
		</div>
	)
}
export default PopupBody
