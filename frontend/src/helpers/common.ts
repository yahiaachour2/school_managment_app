const optionalProperty = (condition: boolean, options: any) => {
    if (condition) {
        return {
            ...options
        }
    }
}

export { optionalProperty };