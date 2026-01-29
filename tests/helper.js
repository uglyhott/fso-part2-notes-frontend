
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, text) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(text)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(text).waitFor()
}
export { loginWith, createNote }
