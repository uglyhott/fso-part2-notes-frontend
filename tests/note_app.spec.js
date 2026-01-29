import {  test, expect } from '@playwright/test'
import { loginWith, createNote } from './helper'

test.describe('Note app', () => {
  // isolate the comman part of both tests to a test.beforeEach block
  test.beforeEach('Note app', async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: 'test'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  }),

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'tester', 'test')

    await expect(page.getByText('Test User logged-in')).toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'test')
    })
    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    test.describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    test.describe('and several notes exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'thrid note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')

        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'tester', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong Credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })
})
