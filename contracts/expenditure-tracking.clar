;; expenditure-tracking.clar
;; This contract tracks actual spending against approved budgets

(define-data-var admin principal tx-sender)

;; Data structure for expenditures
(define-map expenditures
  {
    expenditure-id: (string-ascii 64)
  }
  {
    department-id: (string-ascii 64),
    amount: uint,
    description: (string-ascii 256),
    date: (string-ascii 10),
    approved: bool
  }
)

;; Data structure to track total spending by department
(define-map department-spending
  {
    department-id: (string-ascii 64)
  }
  {
    total-spent: uint,
    fiscal-year: (string-ascii 10)
  }
)

;; Public function to record an expenditure
(define-public (record-expenditure
    (expenditure-id (string-ascii 64))
    (department-id (string-ascii 64))
    (amount uint)
    (description (string-ascii 256))
    (date (string-ascii 10))
  )
  (let (
    (current-spending (default-to { total-spent: u0, fiscal-year: date }
                      (map-get? department-spending { department-id: department-id })))
    )
    (begin
      ;; Only authorized personnel can record expenditures
      (asserts! (or (is-eq tx-sender (var-get admin)) (is-authorized-spender tx-sender)) (err u403))

      ;; Record the expenditure
      (map-set expenditures
        { expenditure-id: expenditure-id }
        {
          department-id: department-id,
          amount: amount,
          description: description,
          date: date,
          approved: false
        }
      )

      ;; Update the department's total spending
      (map-set department-spending
        { department-id: department-id }
        {
          total-spent: (+ (get total-spent current-spending) amount),
          fiscal-year: (get fiscal-year current-spending)
        }
      )

      (ok true)
    )
  )
)

;; Public function to approve an expenditure
(define-public (approve-expenditure (expenditure-id (string-ascii 64)))
  (let ((exp (unwrap! (map-get? expenditures { expenditure-id: expenditure-id }) (err u404))))
    (begin
      (asserts! (is-eq tx-sender (var-get admin)) (err u403))
      (ok (map-set expenditures
        { expenditure-id: expenditure-id }
        (merge exp { approved: true })
      ))
    )
  )
)

;; Read-only function to get an expenditure
(define-read-only (get-expenditure (expenditure-id (string-ascii 64)))
  (map-get? expenditures { expenditure-id: expenditure-id })
)

;; Read-only function to get department spending
(define-read-only (get-department-spending (department-id (string-ascii 64)))
  (map-get? department-spending { department-id: department-id })
)

;; Helper function to check if a principal is authorized to spend
;; In a real implementation, this would check against a list of authorized spenders
(define-read-only (is-authorized-spender (spender principal))
  ;; Placeholder implementation - would be replaced with actual authorization logic
  (is-eq spender (var-get admin))
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)

;; Read-only function to get the current admin
(define-read-only (get-admin)
  (var-get admin)
)
