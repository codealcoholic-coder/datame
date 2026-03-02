     1	import { clsx, type ClassValue } from "clsx"
     2	import { twMerge } from "tailwind-merge"
     3	
     4	export function cn(...inputs: ClassValue[]) {
     5	  return twMerge(clsx(inputs))
     6	}
