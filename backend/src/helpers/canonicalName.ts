 
 
 export function slugify(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-{2,}/g, '-');
}


// const fileName = slugify([prefixName, name].join('_'), {
//     replacement: '_',
//     strict: true,
//     trim: true,
//     lower: true,
// })