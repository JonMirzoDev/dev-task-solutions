const args = process.argv.slice(2)
let longest = ''

if (args.length > 0) {
  for (let i = 0; i < args[0].length; i++) {
    for (let j = i + 1; j <= args[0].length; j++) {
      const currentSubstring = args[0].substring(i, j)
      if (args.every((str) => str.includes(currentSubstring))) {
        if (currentSubstring.length > longest.length) {
          longest = currentSubstring
        }
      }
    }
  }
}

console.log(longest)
