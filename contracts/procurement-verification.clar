;; procurement-verification.clar
;; This contract validates that purchases follow proper procurement procedures

(define-data-var admin principal tx-sender)

;; Data structure for procurement records
(define-map procurement-records
  {
    procurement-id: (string-ascii 64)
  }
  {
    department-id: (string-ascii 64),
    vendor: (string-ascii 128),
    amount: uint,
    description: (string-ascii 256),
    competitive-bidding: bool,
    approved: bool,
    date: (string-ascii 10)
  }
)

;; Data structure for approved vendors
(define-map approved-vendors
  {
    vendor-id: (string-ascii 64)
  }
  {
    name: (string-ascii 128),
    approved: bool,
    approval-date: (string-ascii 10)
  }
)

;; Public function to record a procurement
(define-public (record-procurement
    (procurement-id (string-ascii 64))
    (department-id (string-ascii 64))
    (vendor (string-ascii 128))
    (amount uint)
    (description (string-ascii 256))
    (competitive-bidding bool)
    (date (string-ascii 10))
  )
  (begin
    ;; Only authorized personnel can record procurements
    (asserts! (or (is-eq tx-sender (var-get admin)) (is-procurement-officer tx-sender)) (err u403))

    ;; Record the procurement
    (ok (map-set procurement-records
      { procurement-id: procurement-id }
      {
        department-id: department-id,
        vendor: vendor,
        amount: amount,
        description: description,
        competitive-bidding: competitive-bidding,
        approved: false,
        date: date
      }
    ))
  )
)

;; Public function to approve a procurement
(define-public (approve-procurement (procurement-id (string-ascii 64)))
  (let ((proc (unwrap! (map-get? procurement-records { procurement-id: procurement-id }) (err u404))))
    (begin
      (asserts! (is-eq tx-sender (var-get admin)) (err u403))
      (ok (map-set procurement-records
        { procurement-id: procurement-id }
        (merge proc { approved: true })
      ))
    )
  )
)

;; Public function to add an approved vendor
(define-public (add-approved-vendor (vendor-id (string-ascii 64)) (name (string-ascii 128)) (approval-date (string-ascii 10)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (map-set approved-vendors
      { vendor-id: vendor-id }
      {
        name: name,
        approved: true,
        approval-date: approval-date
      }
    ))
  )
)

;; Read-only function to get a procurement record
(define-read-only (get-procurement (procurement-id (string-ascii 64)))
  (map-get? procurement-records { procurement-id: procurement-id })
)

;; Read-only function to check if a vendor is approved
(define-read-only (is-vendor-approved (vendor-id (string-ascii 64)))
  (match (map-get? approved-vendors { vendor-id: vendor-id })
    vendor (get approved vendor)
    false
  )
)

;; Helper function to check if a principal is a procurement officer
;; In a real implementation, this would check against a list of authorized procurement officers
(define-read-only (is-procurement-officer (officer principal))
  ;; Placeholder implementation - would be replaced with actual authorization logic
  (is-eq officer (var-get admin))
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
