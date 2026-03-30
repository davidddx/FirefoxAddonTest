import {createContext} from 'react' 
export const NumRowsContext = createContext({
	num_rows : {},
	set_num_rows : () => {},
});
export const FriendDataContext = createContext({
	friend_cache : {},
	set_friend_cache : () => {},
});
export const MaxNumRowsContext = createContext({
	max_num_rows: {},
	set_max_num_rows : () => {},
})
