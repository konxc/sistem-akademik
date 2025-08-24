import { test, expect } from '@playwright/test'

// Test data
const testRombel = {
  name: 'A',
  maxStudents: '30'
}

const testRombelUpdate = {
  name: 'B',
  maxStudents: '35'
}

test.describe('Rombel Modal Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to school management page
    await page.goto('/dashboard/school-management')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="school-management-page"]', { timeout: 10000 })
    
    // Mock authentication as SUPER_ADMIN
    await page.addInitScript(() => {
      window.localStorage.setItem('mock-auth', JSON.stringify({
        user: {
          id: 'test-user-id',
          name: 'Super Administrator',
          email: 'superadmin@test.com',
          role: 'SUPER_ADMIN'
        },
        status: 'authenticated'
      }))
    })
  })

  test.describe('Basic Functionality', () => {
    test('should open rombel modal when clicking manage rombel button', async ({ page }) => {
      // Find and click manage rombel button for first class
      const manageRombelButton = page.locator('[data-testid="manage-rombel-button"]').first()
      await expect(manageRombelButton).toBeVisible()
      await manageRombelButton.click()

      // Check if modal opens
      const modal = page.locator('[data-testid="rombel-modal"]')
      await expect(modal).toBeVisible()
      
      // Check modal title
      const modalTitle = modal.locator('[data-testid="modal-title"]')
      await expect(modalTitle).toHaveText('Manajemen Rombel')
    })

    test('should display form fields correctly', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check form fields
      await expect(page.locator('[data-testid="rombel-name-select"]')).toBeVisible()
      await expect(page.locator('[data-testid="max-students-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="submit-button"]')).toBeVisible()
    })

    test('should show required field indicators', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check required field indicators
      const nameLabel = page.locator('label[for="rombelName"]')
      await expect(nameLabel.locator('.text-red-500')).toContainText('*')
      
      const maxStudentsLabel = page.locator('label[for="maxStudents"]')
      await expect(maxStudentsLabel.locator('.text-red-500')).toContainText('*')
    })
  })

  test.describe('Form Validation', () => {
    test('should disable submit button when form is incomplete', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check submit button is disabled initially
      const submitButton = page.locator('[data-testid="submit-button"]')
      await expect(submitButton).toBeDisabled()
      
      // Fill only name field
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      
      // Button should still be disabled
      await expect(submitButton).toBeDisabled()
      
      // Fill max students field
      await page.locator('[data-testid="max-students-input"]').fill('30')
      
      // Button should now be enabled
      await expect(submitButton).toBeEnabled()
    })

    test('should show validation errors for empty fields', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Try to submit empty form
      const submitButton = page.locator('[data-testid="submit-button"]')
      await submitButton.click()
      
      // Check error messages
      await expect(page.locator('text=Nama rombel harus dipilih')).toBeVisible()
      await expect(page.locator('text=Kapasitas maksimal harus diisi')).toBeVisible()
    })

    test('should show validation error for invalid max students', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Fill form with invalid max students
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await page.locator('[data-testid="max-students-input"]').fill('0')
      
      // Check error message
      await expect(page.locator('text=Kapasitas maksimal harus minimal 1')).toBeVisible()
      
      // Submit button should be disabled
      const submitButton = page.locator('[data-testid="submit-button"]')
      await expect(submitButton).toBeDisabled()
    })

    test('should show form completion progress', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check initial progress (0%)
      const progressText = page.locator('text=/Form completion:/')
      await expect(progressText).toBeVisible()
      await expect(page.locator('text=0%')).toBeVisible()
      
      // Fill name field (50%)
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await expect(page.locator('text=50%')).toBeVisible()
      
      // Fill max students field (100%)
      await page.locator('[data-testid="max-students-input"]').fill('30')
      await expect(page.locator('text=100%')).toBeVisible()
    })
  })

  test.describe('Create Rombel', () => {
    test('should create rombel successfully', async ({ page }) => {
      // Mock successful API response
      await page.route('/api/trpc/rombel.create*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                id: 'new-rombel-id',
                name: testRombel.name,
                maxStudents: parseInt(testRombel.maxStudents),
                currentStudents: 0,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Fill form
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await page.locator('[data-testid="max-students-input"]').fill(testRombel.maxStudents)
      
      // Submit form
      await page.locator('[data-testid="submit-button"]').click()
      
      // Check success message
      await expect(page.locator('text=Rombel berhasil dibuat')).toBeVisible()
      
      // Check form is reset
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('')
      await expect(page.locator('[data-testid="max-students-input"]')).toHaveValue('')
    })

    test('should handle create API error', async ({ page }) => {
      // Mock API error
      await page.route('/api/trpc/rombel.create*', async route => {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              code: 'FORBIDDEN',
              message: 'Anda tidak memiliki akses ke fitur ini'
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Fill and submit form
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await page.locator('[data-testid="max-students-input"]').fill(testRombel.maxStudents)
      await page.locator('[data-testid="submit-button"]').click()
      
      // Check error message
      await expect(page.locator('text=Anda tidak memiliki akses untuk melakukan operasi ini')).toBeVisible()
    })
  })

  test.describe('Edit Rombel', () => {
    test('should enter edit mode when clicking edit button', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'existing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-existing-rombel-id"]')
      
      // Click edit button
      await page.locator('[data-testid="edit-rombel-existing-rombel-id"]').click()
      
      // Check form is populated
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('A')
      await expect(page.locator('[data-testid="max-students-input"]')).toHaveValue('30')
      
      // Check modal title changes
      await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Edit Rombel')
    })

    test('should update rombel successfully', async ({ page }) => {
      // Mock successful update
      await page.route('/api/trpc/rombel.update*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                id: 'existing-rombel-id',
                name: testRombelUpdate.name,
                maxStudents: parseInt(testRombelUpdate.maxStudents),
                currentStudents: 15,
                isActive: true
              }
            }
          })
        })
      })

      // Open modal and enter edit mode
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      await page.locator('[data-testid="edit-rombel-existing-rombel-id"]').click()
      
      // Update form
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-B"]').click()
      await page.locator('[data-testid="max-students-input"]').fill(testRombelUpdate.maxStudents)
      
      // Submit update
      await page.locator('[data-testid="submit-button"]').click()
      
      // Check success message
      await expect(page.locator('text=Rombel berhasil diupdate')).toBeVisible()
    })

    test('should handle update API error - rombel not found', async ({ page }) => {
      // Mock 404 error (rombel not found)
      await page.route('/api/trpc/rombel.update*', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'Rombel tidak ditemukan',
              code: 'NOT_FOUND'
            }
          })
        })
      })

      // Open modal and enter edit mode
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      await page.locator('[data-testid="edit-rombel-existing-rombel-id"]').click()
      
      // Update form
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-B"]').click()
      await page.locator('[data-testid="max-students-input"]').fill(testRombelUpdate.maxStudents)
      
      // Submit update
      await page.locator('[data-testid="submit-button"]').click()
      
      // Check error message
      await expect(page.locator('text=Rombel tidak ditemukan')).toBeVisible()
    })
  })

  test.describe('Delete Rombel', () => {
    test('should show enhanced confirmation when deleting editing rombel', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'editing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-editing-rombel-id"]')
      
      // Enter edit mode first
      await page.locator('[data-testid="edit-rombel-editing-rombel-id"]').click()
      
      // Verify we're in edit mode
      await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Edit Rombel')
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('A')
      
      // Now try to delete the rombel that's being edited
      await page.locator('[data-testid="delete-rombel-editing-rombel-id"]').click()
      
      // Check that enhanced confirmation alert appears
      await expect(page.locator('text=Konfirmasi Penghapusan Rombel')).toBeVisible()
      await expect(page.locator('text=Rombel "A" sedang dalam mode edit')).toBeVisible()
      await expect(page.locator('text=Jika Anda menghapus rombel ini, semua perubahan yang belum disimpan akan hilang')).toBeVisible()
      
      // Check action buttons exist
      await expect(page.locator('[data-testid="confirm-delete-action"]')).toBeVisible()
      await expect(page.locator('[data-testid="cancel-delete-action"]')).toBeVisible()
    })

    test('should confirm delete editing rombel and close edit mode', async ({ page }) => {
      // Mock successful delete
      await page.route('/api/trpc/rombel.delete*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                success: true,
                message: 'Rombel berhasil dihapus'
              }
            }
          })
        })
      })

      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'editing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-editing-rombel-id"]')
      
      // Enter edit mode first
      await page.locator('[data-testid="edit-rombel-editing-rombel-id"]').click()
      
      // Try to delete the rombel that's being edited
      await page.locator('[data-testid="delete-rombel-editing-rombel-id"]').click()
      
      // Confirm delete
      await page.locator('[data-testid="confirm-delete-action"]').click()
      
      // Check success message
      await expect(page.locator('text=Rombel berhasil dihapus')).toBeVisible()
      
      // Check that edit mode is closed
      await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Manajemen Rombel')
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('')
    })

    test('should cancel delete editing rombel and stay in edit mode', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'editing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-editing-rombel-id"]')
      
      // Enter edit mode first
      await page.locator('[data-testid="edit-rombel-editing-rombel-id"]').click()
      
      // Try to delete the rombel that's being edited
      await page.locator('[data-testid="delete-rombel-editing-rombel-id"]').click()
      
      // Cancel delete
      await page.locator('[data-testid="cancel-delete-action"]').click()
      
      // Check info message
      await expect(page.locator('text=Penghapusan dibatalkan. Anda dapat melanjutkan mengedit rombel')).toBeVisible()
      
      // Check that we're still in edit mode
      await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Edit Rombel')
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('A')
      
      // Check that confirmation alert is hidden
      await expect(page.locator('text=Konfirmasi Penghapusan Rombel')).not.toBeVisible()
    })

    test('should use simple confirmation for non-editing rombel', async ({ page }) => {
      // Mock successful delete
      await page.route('/api/trpc/rombel.delete*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                success: true,
                message: 'Rombel berhasil dihapus'
              }
            }
          })
        })
      })

      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'non-editing-rombel-id',
                name: 'B',
                maxStudents: 25,
                currentStudents: 10,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.locator('[data-testid="rombel-row-non-editing-rombel-id"]')
      
      // Try to delete rombel that's not being edited
      await page.locator('[data-testid="delete-rombel-non-editing-rombel-id"]').click()
      
      // Check that enhanced confirmation alert does NOT appear
      await expect(page.locator('text=Konfirmasi Penghapusan Rombel')).not.toBeVisible()
      
      // Note: We can't easily test browser confirm dialog in Playwright
      // But we can verify that the enhanced alert doesn't show up
    })
  })

  test.describe('Error Handling & Recovery', () => {
    test('should auto-cleanup when editing deleted rombel', async ({ page }) => {
      // Mock rombel data initially
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'existing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true
              }]
            }
          })
        })
      })

      // Open modal and enter edit mode
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      await page.locator('[data-testid="edit-rombel-existing-rombel-id"]').click()
      
      // Mock rombel data to be empty (deleted)
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: []
            }
          })
        })
      })

      // Trigger data refresh
      await page.locator('[data-testid="refresh-button"]').click()
      
      // Check warning message appears
      await expect(page.locator('text=Rombel yang sedang diedit telah dihapus')).toBeVisible()
      
      // Check form is reset
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('')
      await expect(page.locator('[data-testid="max-students-input"]')).toHaveValue('')
    })

    test('should show warning for editing deleted rombel', async ({ page }) => {
      // Mock empty rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: []
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check warning message
      await expect(page.locator('text=Rombel yang sedang diedit tidak ditemukan')).toBeVisible()
      
      // Check recovery button
      const recoveryButton = page.locator('text=Batalkan Edit & Refresh')
      await expect(recoveryButton).toBeVisible()
    })

    test('should handle concurrent operations gracefully', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'existing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Start editing
      await page.locator('[data-testid="edit-rombel-existing-rombel-id"]').click()
      
      // Try to delete while editing
      await page.locator('[data-testid="delete-rombel-existing-rombel-id"]').click()
      
      // Check error message
      await expect(page.locator('text=Tidak dapat menghapus rombel yang sedang diedit')).toBeVisible()
    })
  })

  test.describe('Status Bar & Visual Feedback', () => {
    test('should display status bar information', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check status bar elements
      await expect(page.locator('[data-testid="status-bar"]')).toBeVisible()
      await expect(page.locator('text=Status: Ready')).toBeVisible()
      await expect(page.locator('text=Total: 0 rombel')).toBeVisible()
      await expect(page.locator('[data-testid="refresh-button"]')).toBeVisible()
    })

    test('should show loading state', async ({ page }) => {
      // Mock slow API response
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: []
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check loading state
      await expect(page.locator('text=Status: Loading...')).toBeVisible()
      await expect(page.locator('[data-testid="refresh-button"]')).toBeDisabled()
    })

    test('should track deleted rombels count', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'rombel-1',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Delete rombel
      await page.locator('[data-testid="delete-rombel-rombel-1"]').click()
      page.on('dialog', dialog => dialog.accept())
      
      // Check deleted count
      await expect(page.locator('text=Deleted: 1')).toBeVisible()
    })

    test('should show last action performed', async ({ page }) => {
      // Mock successful create
      await page.route('/api/trpc/rombel.create*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                id: 'new-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 0,
                isActive: true
              }
            }
          })
        })
      })

      // Open modal and create rombel
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await page.locator('[data-testid="max-students-input"]').fill('30')
      await page.locator('[data-testid="submit-button"]').click()
      
      // Check last action badge
      await expect(page.locator('text=Last: Created')).toBeVisible()
    })
  })

  test.describe('Form State Management', () => {
    test('should reset form when modal opens', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Fill form
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      await page.locator('[data-testid="max-students-input"]').fill('30')
      
      // Close modal
      await page.locator('[data-testid="close-button"]').click()
      
      // Reopen modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check form is reset
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('')
      await expect(page.locator('[data-testid="max-students-input"]')).toHaveValue('')
    })

    test('should handle form validation state changes', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check initial validation state
      await expect(page.locator('text=Form belum lengkap')).toBeVisible()
      
      // Fill name field
      await page.locator('[data-testid="rombel-name-select"]').click()
      await page.locator('[data-testid="rombel-option-A"]').click()
      
      // Check validation message updates
      await expect(page.locator('text=Kapasitas maksimal harus diisi')).toBeVisible()
      await expect(page.locator('text=Nama rombel harus dipilih')).not.toBeVisible()
      
      // Fill max students field
      await page.locator('[data-testid="max-students-input"]').fill('30')
      
      // Check success state
      await expect(page.locator('text=Form siap untuk disubmit')).toBeVisible()
      await expect(page.locator('text=Form belum lengkap')).not.toBeVisible()
    })
  })

  test.describe('Accessibility & Keyboard Navigation', () => {
    test('should support keyboard navigation', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Focus on name select
      await page.keyboard.press('Tab')
      await expect(page.locator('[data-testid="rombel-name-select"]')).toBeFocused()
      
      // Navigate to max students input
      await page.keyboard.press('Tab')
      await expect(page.locator('[data-testid="max-students-input"]')).toBeFocused()
      
      // Navigate to submit button
      await page.keyboard.press('Tab')
      await expect(page.locator('[data-testid="submit-button"]')).toBeFocused()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check ARIA labels
      const nameSelect = page.locator('[data-testid="rombel-name-select"]')
      await expect(nameSelect).toHaveAttribute('aria-label', 'Nama Rombel')
      
      const maxStudentsInput = page.locator('[data-testid="max-students-input"]')
      await expect(maxStudentsInput).toHaveAttribute('aria-label', 'Kapasitas Maksimal')
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Check modal is responsive
      const modal = page.locator('[data-testid="rombel-modal"]')
      await expect(modal).toBeVisible()
      
      // Check form fields are accessible
      await expect(page.locator('[data-testid="rombel-name-select"]')).toBeVisible()
      await expect(page.locator('[data-testid="max-students-input"]')).toBeVisible()
      
      // Check buttons are touch-friendly
      const submitButton = page.locator('[data-testid="submit-button"]')
      const buttonSize = await submitButton.boundingBox()
      expect(buttonSize?.width).toBeGreaterThan(44) // Minimum touch target size
      expect(buttonSize?.height).toBeGreaterThan(44)
    })
  })

  test.describe('Delete Button in Edit Form', () => {
    test('should show delete button in edit form', async ({ page }) => {
      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'editing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-editing-rombel-id"]')
      
      // Enter edit mode
      await page.locator('[data-testid="edit-rombel-editing-rombel-id"]').click()
      
      // Check that delete button appears in form
      await expect(page.locator('[data-testid="delete-rombel-from-form"]')).toBeVisible()
      await expect(page.locator('text=Hapus Rombel')).toBeVisible()
      
      // Check button styling (destructive variant)
      const deleteButton = page.locator('[data-testid="delete-rombel-from-form"]')
      await expect(deleteButton).toHaveClass(/bg-red-600|bg-destructive/)
    })

    test('should not show delete button in create form', async ({ page }) => {
      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Show create form
      await page.locator('[data-testid="toggle-create-form-button"]').click()
      
      // Check that delete button does not appear in create form
      await expect(page.locator('[data-testid="delete-rombel-from-form"]')).not.toBeVisible()
    })

    test('should handle delete from edit form', async ({ page }) => {
      // Mock successful delete
      await page.route('/api/trpc/rombel.delete*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                success: true,
                message: 'Rombel berhasil dihapus'
              }
            }
          })
        })
      })

      // Mock rombel data
      await page.route('/api/trpc/rombel.getByClass*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [{
                id: 'editing-rombel-id',
                name: 'A',
                maxStudents: 30,
                currentStudents: 15,
                isActive: true,
                classId: 'test-class-id',
                schoolId: 'test-school-id'
              }]
            }
          })
        })
      })

      // Open modal
      await page.locator('[data-testid="manage-rombel-button"]').first().click()
      
      // Wait for rombel list to load
      await page.waitForSelector('[data-testid="rombel-row-editing-rombel-id"]')
      
      // Enter edit mode
      await page.locator('[data-testid="edit-rombel-editing-rombel-id"]').click()
      
      // Click delete button from form
      await page.locator('[data-testid="delete-rombel-from-form"]').click()
      
      // Check that enhanced confirmation modal appears
      await expect(page.locator('text=Konfirmasi Penghapusan Rombel')).toBeVisible()
      await expect(page.locator('text=Rombel "A" sedang dalam mode edit')).toBeVisible()
      
      // Confirm delete
      await page.locator('[data-testid="confirm-delete-action"]').click()
      
      // Check success message
      await expect(page.locator('text=Rombel berhasil dihapus')).toBeVisible()
      
      // Check that edit mode is closed
      await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Manajemen Rombel')
      await expect(page.locator('[data-testid="rombel-name-select"]')).toHaveValue('')
    })
  })
})
